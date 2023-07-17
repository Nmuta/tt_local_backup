import BigNumber from 'bignumber.js';
import { GamertagString } from '@models/extended-types';
import { WoodstockBanArea } from './woodstock-ban-request.model';
import { WoodstockBanDescription } from './woodstock-ban-result.model';

/** A single ban summary. */
export interface WoodstockBanSummary {
  xuid: BigNumber;
  gamertag: GamertagString;
  banCount: BigNumber;
  bannedAreas: WoodstockBanArea[];
  lastBanDescription: WoodstockBanDescription;
  userExists: boolean;
}
