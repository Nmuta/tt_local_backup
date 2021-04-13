import BigNumber from 'bignumber.js';
import { GamertagString } from '@models/extended-types';
import { SunriseBanArea } from './sunrise-ban-request.model';
import { SunriseBanDescription } from './sunrise-ban-result.model';

/** A single ban summary. */
export interface SunriseBanSummary {
  xuid: BigNumber;
  gamertag: GamertagString;
  banCount: BigNumber;
  bannedAreas: SunriseBanArea[];
  lastBanDescription: SunriseBanDescription;
  userExists: boolean;
}
