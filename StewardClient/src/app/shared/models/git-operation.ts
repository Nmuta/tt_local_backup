import { DateTime } from 'luxon';

/** Report weight type. */
export enum PullRequestStatus {
  NotSet = 'NotSet',
  Active = 'Active',
  Abandoned = 'Abandoned',
  Completed = 'Completed',
  All = 'All',
}

/** The different string used in pull request titles. */
export enum PullRequestSubject {
  MessageOfTheDay = 'MessageOfTheDay',
  WorldOfForzaTile = 'WoFTile',
  LocalizationString = 'LocalizationString',
}

/** Interface for a a git pull request. */
export interface PullRequest {
  id: number;
  webUrl: string;
  creationDateUtc: DateTime;
  title: string;
}
