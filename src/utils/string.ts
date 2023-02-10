/** Convert the first character of a string to uppercase. */
export function capitalize(string = '') {
  return string.charAt(0).toLocaleUpperCase() + string.slice(1);
}

export function decapitalize(string = '') {
  return string.charAt(0).toLocaleLowerCase() + string.slice(1);
}

export function camelCase(string = '') {
  return decapitalize(
    string
      .replace(/[^a-z0-9]+/gi, ' ')
      .replace(/([A-Z])/g, ' $1')
      .split(' ')
      .map(capitalize)
      .join('')
  );
}

/** Escape regexp characters in a string. */
export const escapeRegExp = (text: string) => {
  return text.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
};

/** Creates RegExp from string. */
export const newRex = (text: string, flags: string) => new RegExp(escapeRegExp(String(text)), flags);

/**
 * Splits a string into two (or more) parts.
 */
export function split(text: string, splitStr: string, all = false): string[] {
  if (all) return text.split(newRex(splitStr, 'g'));
  const idx = text.indexOf(splitStr);
  if (idx === -1) return [text];
  return [text.substring(0, idx), text.substring(idx + splitStr.length)];
}
