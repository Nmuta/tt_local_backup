import BigNumber from 'bignumber.js';
import { GamertagString } from '@models/extended-types';
import { SteelheadBanArea } from './steelhead-ban-request.model';
import { SteelheadBanDescription } from './steelhead-ban-result.model';

/** A single ban summary. */
export interface SteelheadBanSummary {
  xuid: BigNumber;
  gamertag: GamertagString;
  banCount: BigNumber;
  bannedAreas: SteelheadBanArea[];
  lastBanDescription: SteelheadBanDescription;
  userExists: boolean;
}
