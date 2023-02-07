import { objectKeys } from './typescript';

const colors = {
  reset: 0,
  black: 30,
  red: 31,
  green: 32,
  yellow: 33,
  orange: 33, // = yellow
  brown: 33, // = yellow
  blue: 34,
  magenta: 35, // = purple
  purple: 35,
  cyan: 36,
  white: 37,
  gray: 90,
  grey: 90, // = gray
  brightBlack: 90, // = gray
  brightRed: 91,
  brightGreen: 92,
  brightYellow: 93,
  brightBlue: 94,
  brightMagenta: 95,
  brightPurple: 95,
  brightCyan: 96,
  brightWhite: 97,
};
type TColors = keyof typeof colors;

const addColor = (colId: TColors = 'reset', text = '') => {
  const seq = (num = 0) => `\x1b[${num}m`; // 1b = 033 (select graphic rendition)
  return seq(colors[colId] || colors.reset) + text + seq(colors.reset);
};

const getColorizer =
  (color: TColors) =>
  (text = '') =>
    addColor(color, text);

type TColorize = { [key in TColors]: (text: string) => string };

/**
 * Write to console with colored text (16 foreground colors only).
 * Usage: `colorize('red', 'Roses are red.')`.
 */
export const colorize = objectKeys(colors).reduce((acc, key) => {
  acc[key] = getColorizer(key);
  return acc;
}, {} as TColorize);
