import { GamertagString } from '@models/extended-types';
import { ApolloBanArea } from './apollo-ban-request.model';
import { ApolloBanDescription } from './apollo-ban-result.model';

/** A single ban summary. */
export interface ApolloBanSummary {
  xuid: bigint;
  gamertag: GamertagString;
  banCount: bigint;
  bannedAreas: ApolloBanArea[];
  lastBanDescription: ApolloBanDescription;
  userExists: boolean;
}
