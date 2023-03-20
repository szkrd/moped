/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Parses query string into an object using URLSearchParams:
 * `?foo=1&bar=2` -> `{ foo: '1', bar: '2' }`
 */
function parse(text: string): Record<string, string> {
  return Object.fromEntries(new URLSearchParams(text) as any);
}

/**
 * Converts object to query string using URLSearchParams:
 * `{ foo: '1', bar: '2' }` -> `foo=1&bar=2`
 */
function from(obj: Record<string, string | number | boolean>): string {
  const params = new URLSearchParams('');
  for (const prop in obj) params.append(prop, String(obj[prop]));
  return params.toString();
}

export const queryString = { from, parse };
