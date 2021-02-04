import { GamertagString } from '@models/extended-types';
import { SunriseBanArea } from './sunrise-ban-request.model';
import { SunriseBanDescription } from './sunrise-ban-result.model';

/** A single ban summary. */
export interface SunriseBanSummary {
  xuid: bigint;
  gamertag: GamertagString;
  banCount: bigint;
  bannedAreas: SunriseBanArea[];
  lastBanDescription: SunriseBanDescription;
  userExists: boolean;
}
