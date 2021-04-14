import { faker } from '.';

/** Generate a fake T10 Id. */
export function fakeT10Id(): string {
  return faker.random.uuid();
}
