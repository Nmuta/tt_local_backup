import * as faker from 'faker';

/** Generate a fake xuid. */
export function fakeXuid() {
  return faker.random.number();
}
