import BigNumber from 'bignumber.js';
import { GamertagString } from '@models/extended-types';
import { DateTime } from 'luxon';

/** A single part of the bulk /v2/title/multi/players/forumBan request model */
export interface ForumBanRequest {
  xuid: BigNumber;
  gamertag: GamertagString;
  reason: string;
  issuedDateUtc: DateTime;
}
