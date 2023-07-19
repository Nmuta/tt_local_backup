import { DateTime } from 'luxon';

/** The /v1/title/Woodstock/player/???/profile-rollback model. */
export interface WoodstockProfileRollback {
  dateUtc: DateTime;
  author: string;
  details: string;
}
