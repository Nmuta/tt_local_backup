import realFaker from '@faker-js/faker';
export * from './fake-xuid';
export * from './fake-bigint';
export * from './fake-gamertag';

/** Faker */
export const faker = realFaker; // just so imports will work properly.
