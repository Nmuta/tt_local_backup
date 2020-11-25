/** The /v1/title/opus/player/???/details model */
export interface OpusPlayerDetails {
  xuid: BigInt;
  gamertag: string;
  licensePlate: string;
  ageGroup: string;
  subscriptionTier: string;
  country: BigInt;
  region: BigInt;
  lcid: BigInt;
  ipAddress: string;
  lastLoginUtc: Date;
  firstLoginUtc: Date;
  currentDriverModelId: BigInt;
  currentPlayerTitleId: string;
  currentBadgeId: string;
  currentCareerLevel: BigInt;
  acceptsClubInvites: boolean;
  clubTopTierCount: BigInt;
  clubTag: string;
  roleInClub: string;
}
