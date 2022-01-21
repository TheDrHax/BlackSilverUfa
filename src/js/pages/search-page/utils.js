export const pluralize = (num, words = ['', '', '']) => {
  if (num < 0) {
    num = Math.abs(num);
  }

  if (num >= 100) {
    num %= 100;
  }

  if (num >= 20) {
    num %= 10;
  }

  if (num === 1) {
    return words[0];
  } else if (num > 1 && num < 5) {
    return words[1];
  } else {
    return words[2];
  }
};

export const renderTemplate = (str, vars) => {
  (str.match(/\{.*?\}/g) || []).forEach((key) => {
    key = key.substring(1, key.length - 1);
    let value;

    if (key.indexOf('#') !== -1) {
      const [valKey, args] = key.split('#');
      value = pluralize(vars[valKey], args.split(','));
    } else {
      value = vars[key];
    }

    str = str.replace(`{${key}}`, value);
  });

  return str;
};
