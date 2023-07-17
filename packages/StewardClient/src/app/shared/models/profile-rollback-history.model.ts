import { DateTime } from 'luxon';

/** The /v2/title/:title/player/:xuid/saveRollbackLog model. */
export interface ProfileRollbackHistory {
  eventTimeUtc: DateTime;
}
