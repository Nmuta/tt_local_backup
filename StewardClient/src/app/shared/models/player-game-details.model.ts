import BigNumber from 'bignumber.js';
import { DateTime } from 'luxon';

/** The /v2/title/???/player/???/gameDetails model */
export interface PlayerGameDetails {
  xuid: BigNumber;
  gamertag: string;
  lastLoginDateUtc: DateTime;
  firstLoginDateUtc: DateTime;
}
