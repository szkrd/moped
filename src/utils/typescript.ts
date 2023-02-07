/** Typehinted version of Object.keys */
export const objectKeys = Object.keys as <T>(o: T) => Extract<keyof T, string>[];
