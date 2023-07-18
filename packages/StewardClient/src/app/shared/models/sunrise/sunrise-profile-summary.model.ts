import BigNumber from 'bignumber.js';
/** The /v1/title/Sunrise/player/???/profileSummary model */
export interface SunriseProfileSummary {
  totalTombolaSpins: BigNumber;
  totalSuperTombolaSpins: BigNumber;
  currentCredits: BigNumber;
  maxCredits: BigNumber;
  housesPurchased: BigNumber;
  unaccountedForCredits: BigNumber;
  totalXp: BigNumber;
  hackFlags: string[];
}
