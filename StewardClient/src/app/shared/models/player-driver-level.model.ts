import { BigNumber } from 'bignumber.js';

/** The /v2/title/{steelhead}/{xuid}/driverLevel model */
export interface PlayerDriverLevel {
  driverLevel: BigNumber;
  prestigeRank: BigNumber;
  experiencePoints: BigNumber;
}
