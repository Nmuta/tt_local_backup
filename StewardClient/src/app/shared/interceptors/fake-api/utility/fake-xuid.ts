import * as faker from 'faker';

/** Generate a fake xuid. */
export function fakeXuid(): number {
  return faker.random.number();
}
