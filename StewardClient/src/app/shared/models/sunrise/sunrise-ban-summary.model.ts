import { SunriseBanDescription } from './sunrise-ban-result.model';

/** A single ban summary. */
export interface SunriseBanSummary {
  xuid: BigInt,
  gamertag: string,
  banCount: BigInt,
  bannedAreas: string[],
  lastBanDescription: SunriseBanDescription,
  userExists: boolean
}