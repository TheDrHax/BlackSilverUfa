from ..data.timecodes import T, Timecodes
from ..data.streams import StreamType
from ..data.loader.default import streams


def get_stats():
    duration_streams, duration_segments = T, T

    streams_total = 0
    chats_total = 0
    messages = 0
    claims = 0
    streams_claimed = 0
    streams_claimed_duration = 0
    claims_duration = 0

    for stream in streams.values():
        if stream.type is StreamType.JOINED:
            continue

        if stream.type is not StreamType.NO_CHAT:
            chats_total += 1

        streams_total += 1
        duration_streams += stream.duration
        messages += stream.messages

        claim, _ = stream.timecodes.find('Проблемы с правообладателями', depth=0)
        if isinstance(claim, Timecodes):
            streams_claimed += 1
            streams_claimed_duration += stream.duration
            claims_duration += claim.duration

            for t in claim:
                if isinstance(t, Timecodes):
                    claims += len(t)
                else:
                    claims += 1

        for segment in stream:
            duration_segments += segment.duration

    official, unofficial, missing = 0, 0, 0

    for segment in streams.segments:
        if len(segment.references) == 0:
            continue
        if segment.youtube:
            if not segment.official:
                unofficial += 1
            else:
                official += 1
        else:
            missing += 1

    return {
        'counts': {
            'streams': {
                'total': streams_total,
                'with_chats': chats_total
            },
            'segments': {
                'total': official + unofficial + missing,
                'official': official,
                'unofficial': unofficial,
                'missing': missing
            },
            'messages': messages
        },
        'durations': {
            'streams': int(duration_streams),
            'segments': int(duration_segments)
        },
        'content_id': {
            'streams': streams_claimed,
            'count': claims,
            'total': int(claims_duration),
            'percentage': round(int(claims_duration) / int(streams_claimed_duration) * 10000) / 100
        }
    }
