import BigNumber from 'bignumber.js';
/** The /v1/title/Woodstock/player/???/profileSummary model */
export interface WoodstockProfileSummary {
  totalTombolaSpins: BigNumber;
  totalSuperTombolaSpins: BigNumber;
  currentCredits: BigNumber;
  maxCredits: BigNumber;
  housesPurchased: BigNumber;
  unaccountedForCredits: BigNumber;
  totalXp: BigNumber;
  hackFlags: string[];
}
