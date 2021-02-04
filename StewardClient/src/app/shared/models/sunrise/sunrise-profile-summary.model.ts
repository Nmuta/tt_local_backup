/** The /v1/title/Sunrise/player/???/profileSummary model */
export interface SunriseProfileSummary {
  totalTombolaSpins: bigint;
  totalSuperTombolaSpins: bigint;
  currentCredits: bigint;
  maxCredits: bigint;
  housesPurchased: bigint;
  unaccountedForCredits: bigint;
  totalXp: bigint;
  hackFlags: string[];
}
