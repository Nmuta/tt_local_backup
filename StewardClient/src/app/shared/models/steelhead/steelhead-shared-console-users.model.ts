import BigNumber from 'bignumber.js';
import { GamertagString } from '@models/extended-types';

/** A single shared console user. */
export interface SteelheadSharedConsoleUser {
  sharedConsoleId: BigNumber;
  xuid: BigNumber;
  gamertag: GamertagString;
  everBanned: boolean;
}
