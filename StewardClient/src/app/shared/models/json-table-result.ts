/** Interface for a JSON Table result. */
export type JsonTableResult<T> = T & {
  showErrorInTable: boolean;
};
