import { GamertagString } from '@models/extended-types';
import { ApolloBanArea } from './apollo-ban-request.model';
import { ApolloBanDescription } from './apollo-ban-result.model';

/** A single ban summary. */
export interface ApolloBanSummary {
  xuid: BigInt;
  gamertag: GamertagString;
  banCount: BigInt;
  bannedAreas: ApolloBanArea[];
  lastBanDescription: ApolloBanDescription;
  userExists: boolean;
}
