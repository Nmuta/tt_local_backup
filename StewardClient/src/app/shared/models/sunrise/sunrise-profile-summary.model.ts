/** The /v1/title/Sunrise/player/???/profileSummary model */
export interface SunriseProfileSummary {
  totalTombolaSpins: number;
  totalSuperTombolaSpins: number;
  currentCredits: number;
  maxCredits: number;
  housesPurchased: number;
  unaccountedForCredits: number;
  totalXp: number;
  hackFlags: string[];
}
