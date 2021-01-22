import { ApolloBanDescription } from './apollo-ban-result.model';

/** A single ban summary. */
export interface ApolloBanSummary {
  xuid: BigInt,
  gamertag: string,
  banCount: BigInt,
  bannedAreas: string[],
  lastBanDescription: ApolloBanDescription,
  userExists: boolean
}