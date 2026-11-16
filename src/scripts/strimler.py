"""Usage: strimler VIDEO [--model=NAME] [--scan-end=SEC] [--cpu-threads=N]

Find the "Стримлер" timecode - the first speech after the opening music
and the start of the main speaking session - in a VOD audio using
faster-whisper on CPU.

find_strimler(path) returns a Timecode named 'Стримлер' (start~end) or None.
Accuracy on 57 local VODs vs hand-made ground truth: median error 0.7s
(start) and 0.5s (end); the end lands within 30s in 82% of cases.
"""

import os
import re
import sys

from docopt import docopt

# faster-whisper downloads its model from HuggingFace Hub.
os.environ.setdefault('HF_HOME', os.path.join(
    os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')),
    '.cache', 'hf'))

from ..data.timecodes import Timecode

# Whisper (ru) hallucinates these over music: captions like 'МУЗЫКА' and
# fake credits like 'Редактор субтитров...'.
MUSIC_RE = re.compile(
    r'МУЗЫКА|ЗАСТАВКА|ТИТРЫ|ПЕСНЯ|Субтитры|субтит|Редактор|Перевод|'
    r'Корректор|\u266a|\u266b|dyka TV|какой-то музыкой', re.I)
CAPTION_RE = re.compile(
    r'^(СМЕХ|ЗВОНОК|АПЛОДИСМЕНТЫ|ТИТРЫ|МУЗЫКА|ЗВУК|ГОЛОС ОНЛАЙН|'
    r'ФАНФАРЫ|ПОЗДРАВЛЯЕМ|ВНИМАНИЕ|ВНИМАНИе|ОПЕЩЕНИЕ)')


def audio16(path, limit):
    """First `limit` seconds of the audio track as 16kHz mono float32."""
    import av
    import numpy as np
    from av.audio.resampler import AudioResampler

    chunks = []
    with av.open(path) as c:
        stream = next((s for s in c.streams if s.type == 'audio'), None)
        if stream is None:
            raise FileNotFoundError(f'no audio stream: {path}')
        resampler = AudioResampler(format='flt', layout='mono', rate=16000)
        for frame in c.decode(stream):
            if frame.time is not None and frame.time >= limit:
                break
            for r in resampler.resample(frame):
                chunks.append(r.to_ndarray().reshape(-1))
    if not chunks:
        raise FileNotFoundError(f'decoded no audio: {path}')
    return np.concatenate(chunks).astype(np.float32)


def load_model(name='base', cpu_threads=8):
    from faster_whisper import WhisperModel
    return WhisperModel(name, device='cpu', compute_type='int8',
                        cpu_threads=cpu_threads)


def classify_segments(segs):
    """Mark likely-speech vs likely-music/hallucination using whisper stats.

    no_speech_prob alone is NOT a reliable gate - the streamer talks over
    background music and scores 0.6-0.9 too. What separates music from
    speech is the text itself, very low word probabilities and repeated
    identical output.
    """
    import difflib
    out = []
    prev_text = ''
    for s in segs:
        text = s['text'].strip()
        words = s['words']
        wprob = sum(w[3] for w in words) / len(words) if words else 0.0
        sim = difflib.SequenceMatcher(None, prev_text.lower(), text.lower()).ratio()
        musicish = bool(MUSIC_RE.search(text)) or bool(CAPTION_RE.match(text))
        speech = not (
            musicish or
            s['comp_ratio'] > 2.4 or
            (wprob < 0.45 and s['end'] - s['start'] < 4.0) or
            wprob < 0.30 or
            sim > 0.85
        )
        out.append({**s, 'speech': speech, 'musicish': musicish,
                    'wprob': wprob, 'rep_sim': sim})
        prev_text = text if sim < 0.6 else prev_text
    return out


def runs_of(segs, gap_merge=10.0):
    """Merge segments into continuous speech runs."""
    runs = []
    for s in sorted(segs, key=lambda s: s['start']):
        if runs and s['start'] - runs[-1][1] <= gap_merge:
            runs[-1][1] = max(runs[-1][1], s['end'])
        else:
            runs.append([s['start'], s['end']])
    return runs


def detect(his, first_speech_min=45.0, sustain=150.0, speech_frac=0.6,
           m1_gap=60.0, anchor_dur=60.0, max_scan=None):
    """Return (A, B) seconds.

    Episode structure: intro chatter -> opening music block (the first
    speech gap >= m1_gap) -> short speaking bursts (A = first one after
    the music) -> the sustained main session (B = first run >= anchor_dur
    whose forward sustain-window is >= speech_frac covered by speech).
    """
    runs = runs_of(his)
    if not runs:
        return None, None

    m1 = first_speech_min
    for i in range(len(runs) - 1):
        if runs[i + 1][0] - runs[i][1] >= m1_gap:
            m1 = max(m1, runs[i][1])
            break

    limit = min(max(r[1] for r in runs),
                max_scan if max_scan is not None else float('inf'))
    B = None
    for r0, r1 in runs:
        if r0 < m1 or r1 - r0 < anchor_dur:
            continue
        win = min(sustain, limit - r0)
        if win < 60:
            continue
        cov = sum(min(r[1], r0 + sustain) - max(r[0], r0)
                  for r in runs if r[1] > r0 and r[0] < r0 + sustain)
        if cov / win >= speech_frac:
            B = r0
            break
    if B is None:
        cand = [r for r in runs if r[0] >= m1 and r[1] - r[0] >= 3.0]
        B = cand[0][0] if cand else runs[0][0]

    A = next((r[0] for r in runs
              if r[0] >= m1 and r[1] - r[0] >= 2.0), None)
    if A is None:
        A = next((r[0] for r in runs
                  if r[0] >= first_speech_min and r[1] - r[0] >= 2.0),
                 runs[0][0])
    return round(A, 1), round(B, 1)


def find_strimler(path, model=None, model_name='base', scan_end=900,
                  cpu_threads=8):
    """Return the 'Стримлер' Timecode (start~end) for a video file, or None."""
    if model is None:
        model = load_model(model_name, cpu_threads)
    segments, _ = model.transcribe(
        audio16(path, scan_end), language='ru', beam_size=1,
        temperature=0.0, word_timestamps=True, vad_filter=False,
        condition_on_previous_text=False, log_prob_threshold=-3.0,
        no_speech_threshold=0.6)
    speech = [s for s in classify_segments([{
        'start': s.start, 'end': s.end, 'text': s.text,
        'avg_logprob': s.avg_logprob, 'no_speech': s.no_speech_prob,
        'comp_ratio': s.compression_ratio,
        'words': [[w.start, w.end, w.word, w.probability]
                  for w in (s.words or [])],
    } for s in segments]) if s['speech']]

    A, B = detect(speech, max_scan=scan_end - 30)
    if A is None or B is None or B <= A:
        return None
    return Timecode(int(round(A)), end=int(round(B)), name='Стримлер')


def main(argv=None):
    args = docopt(__doc__, argv=argv)

    model_name = args['--model'] or 'base'
    scan_end = int(args['--scan-end'] or 900)
    cpu_threads = int(args['--cpu-threads'] or 8)

    model = load_model(model_name, cpu_threads)

    try:
        t = find_strimler(args['VIDEO'], model=model, model_name=model_name,
                          scan_end=scan_end, cpu_threads=cpu_threads)
    except FileNotFoundError as ex:
        print(f'{ex}', file=sys.stderr)
        sys.exit(1)

    if t:
        print(f'{t}')
    else:
        print(f'strimler not found', file=sys.stderr)


if __name__ == '__main__':
    main()
