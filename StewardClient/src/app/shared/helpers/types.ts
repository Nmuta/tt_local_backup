/** Removes a given key from an object's type. */
export type Without<T, K> = Pick<T, Exclude<keyof T, K>>;

/**
 * Exctracts the public interface of a given type.
 * For use with mocks as public class ThingMock implements PublicInterface<Thing>
 */
export type PublicInterface<T> = {
  [P in keyof T]: T[P];
};
