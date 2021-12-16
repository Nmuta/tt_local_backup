/** Removes a given key from an object's type. */
export type Without<T, K> = Pick<T, Exclude<keyof T, K>>;
