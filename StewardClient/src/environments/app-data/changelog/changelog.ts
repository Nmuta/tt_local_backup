import { CHANGELOG_2022_Q2_Q3 } from './2022-Q2-Q3.changelog';
import { CHANGELOG_2022_Q4 } from './2022-Q4.changelog';
import { CHANGELOG_2023_Q1 } from './2023-LATEST-Q1.changelog';
import { Changelog } from './types';

/** All loaded changelogs. */
export const CHANGELOG: Changelog = {
  active: [CHANGELOG_2023_Q1, CHANGELOG_2022_Q4],
  inactive: [CHANGELOG_2022_Q2_Q3],
};
