import { CHANGELOG_2022_Q2_Q3 } from './2022-Q2-Q3.changelog';
import { CHANGELOG_2022_Q4 } from './2022-Q4.changelog';
import { CHANGELOG_2023_Q1 } from './2023-Q1.changelog';
import { CHANGELOG_2023_Q2 } from './2023-Q2.changelog';
import { CHANGELOG_2023_Q3 } from './2023-Q3-LATEST.changelog';
import { Changelog } from './types';

/** All loaded changelogs. */
export const CHANGELOG: Changelog = {
  active: [CHANGELOG_2023_Q3, CHANGELOG_2023_Q2],
  inactive: [CHANGELOG_2023_Q1, CHANGELOG_2022_Q4, CHANGELOG_2022_Q2_Q3],
};
