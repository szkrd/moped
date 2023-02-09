export function parseBoolean(val: unknown) {
  if (['true', '1', 'yes'].includes(String(val))) return true;
  if (['false', '0', 'no'].includes(String(val))) return false;
  return null;
}

export function parseBooleanOrOneshot(val: unknown): boolean | 'oneshot' | null {
  if (val === 'oneshot') return 'oneshot';
  return parseBoolean(val);
}
