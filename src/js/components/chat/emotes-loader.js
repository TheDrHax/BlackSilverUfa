const getEmoteUrl = (source, id) => {
  if (source === 'twitch') {
    return `//static-cdn.jtvnw.net/emoticons/v2/${id}/static/dark/1.0`;
  } else if (source === 'betterttv') {
    return `//cdn.betterttv.net/emote/${id}/1x`;
  } else if (source === 'frankerfacez') {
    return `//cdn.frankerfacez.com/emote/${id}/1`;
  } else {
    return '';
  }
};

const EMOTE_PRIORITIES = { // lowest priority first
  source: ['frankerfacez', 'betterttv', 'twitch'],
  scope: ['global', 'channel'],
};

export const loadEmotes = async () => {
  const emotes = await fetch('/data/emotes.json').then((res) => res.json());
  const data = {};

  EMOTE_PRIORITIES.source.forEach((source) => (
    EMOTE_PRIORITIES.scope.forEach((scope) => {
      if (emotes[source] && emotes[source][scope]) {
        Object.entries(emotes[source][scope]).forEach(([name, id]) => {
          data[name] = getEmoteUrl(source, id);
        });
      }
    })
  ));

  const pattern = new RegExp(`^(${Object.keys(data).join('|')})$`);

  return { data, pattern };
};
