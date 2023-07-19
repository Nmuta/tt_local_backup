import BigNumber from 'bignumber.js';
import { GamertagString } from '@models/extended-types';
import { ApolloBanArea } from './apollo-ban-request.model';
import { ApolloBanDescription } from './apollo-ban-result.model';

/** A single ban summary. */
export interface ApolloBanSummary {
  xuid: BigNumber;
  gamertag: GamertagString;
  banCount: BigNumber;
  bannedAreas: ApolloBanArea[];
  lastBanDescription: ApolloBanDescription;
  userExists: boolean;
}
