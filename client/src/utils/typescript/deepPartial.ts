/** BE CAREFUL, this may really fry some builders/editors because of the recursion */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
