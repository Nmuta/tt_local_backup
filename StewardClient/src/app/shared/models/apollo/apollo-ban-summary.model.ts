import { ApolloBanArea } from './apollo-ban-request.model';
import { ApolloBanDescription } from './apollo-ban-result.model';

/** A single ban summary. */
export interface ApolloBanSummary {
  xuid: BigInt;
  gamertag: string;
  banCount: BigInt;
  bannedAreas: ApolloBanArea[];
  lastBanDescription: ApolloBanDescription;
  userExists: boolean;
}
