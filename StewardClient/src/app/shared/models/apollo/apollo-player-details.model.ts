import { GamertagString } from '@models/extended-types';

/** The /v1/title/apollo/player/???/details model */
export interface ApolloPlayerDetails {
  xuid: bigint;
  gamertag: GamertagString;
  currentProfileId: bigint;
  subscriptionTier: string;
  ageGroup: string;
  country: bigint;
  region: bigint;
  lcid: bigint;
  ipAddress: string;
  lastLoginUtc: Date;
  firstLoginUtc: Date;
  currentDriverModelId: bigint;
  currentPlayerTitleId: string;
  currentBadgeId: string;
  clubTag: string;
  clubId: string;
  roleInClub: string;
  currentCareerLevel: bigint;
  equippedVanityItemId: bigint;
  currentCarCollectionTier: string;
  currentCarCollectionScore: bigint;
}
