import * as Loki from 'lokijs';
import { ptime } from '../../utils/time-utils';

const LINE_BREAK = /\\N/g;

export const loadSubtitles = async (url) => {
  const db = new Loki('chat');
  const data = db.addCollection('messages', { indices: ['time'] });

  const lines = await fetch(url)
    .then((res) => res.text())
    .then((res) => res.split('\n'));

  let firstLine = true;

  for (let line of lines) {
    if (firstLine) {
      if (!line.startsWith('[Script Info]')) {
        throw new Error('Файл повреждён или недоступен');
      }

      firstLine = false;
    }

    const hidden = line.startsWith('; ');

    if (hidden) {
      line = line.substring(2);
    }

    if (line.startsWith('Dialogue: ')) {
      const parts = line.substring(10).split(', ');

      const [userStr, ...msgParts] = parts.slice(3).join(' ').split(': ');
      const text = msgParts.join(': ').replace(LINE_BREAK, '');
      const time = ptime(parts[1]);

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
