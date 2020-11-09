/** The /v2/title/opus/player/???/details model */
export interface OpusPlayerDetails {
  xuid: number;
  gamertag: string;
  licensePlate: string;
  ageGroup: string;
  subscriptionTier: string;
  country: number;
  region: number;
  lcid: number;
  ipAddress: string;
  lastLoginUtc: string;
  firstLoginUtc: string;
  currentDriverModelId: number;
  currentPlayerTitleId: string;
  currentBadgeId: string;
  currentCareerLevel: number;
  acceptsClubInvites: boolean;
  clubTopTierCount: number;
  clubTag: string;
  roleInClub: string;
}
