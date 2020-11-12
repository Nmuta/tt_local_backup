/** The /v2/title/apollo/player/???/details model */
export interface ApolloPlayerDetails {
  xuid: BigInt;
  gamertag: string;
  currentProfileId: BigInt;
  subscriptionTier: string;
  ageGroup: string;
  country: BigInt;
  region: BigInt;
  lcid: BigInt;
  ipAddress: string;
  lastLoginUtc: Date;
  firstLoginUtc: Date;
  currentDriverModelId: BigInt;
  currentPlayerTitleId: string;
  currentBadgeId: string;
  clubTag: string;
  clubId: string;
  roleInClub: string;
  currentCareerLevel: BigInt;
  equippedVanityItemId: BigInt;
  currentCarCollectionTier: string;
  currentCarCollectionScore: BigInt;
}
