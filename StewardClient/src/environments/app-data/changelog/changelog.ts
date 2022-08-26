import { CHANGELOG_2022_Q2_Q3 } from './2022-Q2-Q3.changelog';
import { CHANGELOG_2022_Q4 } from './2022-LATEST-Q4.changelog';
import { Changelog } from './types';

/** All loaded changelogs. */
export const CHANGELOG: Changelog = {
  active: [CHANGELOG_2022_Q4, CHANGELOG_2022_Q2_Q3],
  inactive: [],
};
