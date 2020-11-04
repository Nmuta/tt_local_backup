// https://stackoverflow.com/questions/41980195/recursive-partialt-in-typescript

// prettier-ignore
/** Recursive partial. */
export type RecursivePartial<T> = {
  [P in keyof T]?: // only allow keys from the parent type
    T[P] extends (infer U)[] // query "is array?"
      ? RecursivePartial<U>[] // if this is an array, spit out the array recursion
      : T[P] extends object // if this is not an array, query "is object"
        ? RecursivePartial<T[P]> // if this is an object, return the object recursion
        : T[P]; // otherwise the final type (the ? at the start is what makes this "partial")
};
// prettier-ignore
/** Recursive type-or-string. */
export type RecursiveTypeOrString<T> = {
  [P in keyof T]: // only allow keys from the parent type
    T[P] extends (infer U)[] // query "is array"
      ? RecursiveTypeOrString<U>[] // if this is an array, spit out the array recursion
      : T[P] extends object // if this is not an array, query "is object"
        ? RecursiveTypeOrString<T[P]> // if this is an object, return the object recursion
        : (T[P] | string); // otherwise the final type
};

/** Represents the unprocessed version of a model, array or otherwise. */
export type Unprocessed<T> = RecursivePartial<RecursiveTypeOrString<T>>;
