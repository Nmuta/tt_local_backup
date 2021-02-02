/** The /v1/title/Sunrise/player/???/profileSummary model */
export interface SunriseProfileSummary {
  totalTombolaSpins: BigInt;
  totalSuperTombolaSpins: BigInt;
  currentCredits: BigInt;
  maxCredits: BigInt;
  housesPurchased: BigInt;
  unaccountedForCredits: BigInt;
  totalXp: BigInt;
  hackFlags: string[];
}
