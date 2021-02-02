import * as faker from 'faker';

/** Generate a fake xuid. */
export function fakeXuid(): BigInt {
  return BigInt(Number.MAX_SAFE_INTEGER) + BigInt(faker.random.number());
}
