export function parseIntSafe(val: unknown, fallback: number): number {
  const convertedNum = parseInt(String(val), 10);
  const validNumber = typeof convertedNum === 'number' && isFinite(convertedNum) && !isNaN(convertedNum);
  return validNumber ? convertedNum : fallback;
}
