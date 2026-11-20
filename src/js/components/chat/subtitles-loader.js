import * as Loki from 'lokijs';
import zip from 'lodash/zip';
import { ptime } from '../../utils/time-utils';

const LINE_BREAK = /\\N/g;

// https://stackoverflow.com/a/29998400
const JavaSplit = (string, separator, n) => {
  const split = string.split(separator);
  if (split.length <= n) return split;
  const out = split.slice(0, n - 1);
  out.push(split.slice(n - 1).join(separator));
  return out;
};

export const loadSubtitles = async (url) => {
  const db = new Loki('chat');
  const data = db.addCollection('messages', { indices: ['time'] });

  const lines = await fetch(url)
    .then((res) => res.text())
    .then((res) => res.split('\n'));

  let firstLine = true;
  let eventsSection = false;
  let format = null;

  for (let line of lines) {
    if (firstLine) {
      if (!line.startsWith('[Script Info]')) {
        throw new Error('Файл повреждён или недоступен');
      }

      firstLine = false;
    }

    if (!eventsSection && line.startsWith('[Events]')) {
      eventsSection = true;
    }

    if (eventsSection && !format && line.startsWith('Format:')) {
      format = line.substring(8).split(', ');

      for (const k of ['Start', 'Text']) {
        if (format.indexOf(k) === -1) {
          throw new Error('Файл повреждён или недоступен');
        }
      }
    }

    if (!format) {
      continue;
    }

    const hidden = line.startsWith('; ');

    if (hidden) {
      line = line.substring(2);
    }

    if (line.startsWith('Dialogue: ')) {
      const parts = Object.assign({},
        ...zip(format, JavaSplit(line.substring(10), ', ', format.length))
          .map(([k, v]) => ({ [k]: v })),
      );

      const [userStr, ...msgParts] = (parts.Text ?? '').split(': ');
      const text = msgParts.join(': ').replace(LINE_BREAK, '');
      const time = ptime(parts.Start);

      let user = userStr;
      let color = 'inherit';

      if (userStr.startsWith('{\\c&H')) {
        user = userStr.substring(13, 13 + userStr.length - 13 * 2);

        // BGR to RGB
        color = userStr.substring(9, 11) + userStr.substring(7, 9) + userStr.substring(5, 7);
        color = `#${color}`;

        if (color === '#FFFFFF') {
          color = 'inherit';
        }
      }

      data.insert({ time, user, text, color, hidden });
    }
  }

  return data;
};
