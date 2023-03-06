export function parseIntSafe(val: unknown, fallback = -1): number {
  const convertedNum = parseInt(String(val), 10);
  const validNumber = typeof convertedNum === 'number' && isFinite(convertedNum) && !isNaN(convertedNum);
  return validNumber ? convertedNum : fallback;
}

export function parseIntOrNull(val: unknown): number | null {
  const convertedNum = parseInt(String(val), 10);
  return typeof convertedNum === 'number' && isFinite(convertedNum) && !isNaN(convertedNum) ? convertedNum : null;
}

export function parsePercentOrNull(val: unknown): number | null {
  const num = parseIntOrNull(val);
  return num === null || num > 100 || num < 0 ? null : num;
}

export function parseFloatSafe(val: unknown, fallback = -1): number {
  const convertedNum = parseFloat(String(val));
  const validNumber = typeof convertedNum === 'number' && isFinite(convertedNum) && !isNaN(convertedNum);
  return validNumber ? convertedNum : fallback;
}

export function parseFloatRelativeSafe(val: unknown, fallback = -1): string | number {
  const convertedNum = parseFloatSafe(String(val), fallback);
  console.log('1>>>', String(val));
  return String(val).startsWith('+') ? `+${convertedNum}` : convertedNum;
}

export function parseNumberSafe(val: unknown, fallback: number): number {
  return (String(val).includes('.') ? parseFloatSafe : parseIntSafe)(val, fallback);
}
