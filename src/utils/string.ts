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
