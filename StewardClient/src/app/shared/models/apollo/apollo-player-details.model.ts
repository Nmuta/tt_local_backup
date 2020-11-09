/** The /v2/title/apollo/player/???/details model */
export interface ApolloPlayerDetails {
  xuid: number;
  gamertag: string;
  currentProfileId: number;
  subscriptionTier: string;
  ageGroup: string;
  country: number;
  region: number;
  lcid: number;
  ipAddress: string;
  lastLoginUtc: string;
  firstLoginUtc: string;
  currentDriverModelId: number;
  currentPlayerTitleId: string;
  currentBadgeId: string;
  clubTag: string;
  clubId: string;
  roleInClub: string;
  currentCareerLevel: number;
  equippedVanityItemId: number;
  currentCarCollectionTier: string;
  currentCarCollectionScore: number;
}