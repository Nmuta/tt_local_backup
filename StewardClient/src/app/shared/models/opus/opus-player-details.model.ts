import { GamertagString } from '@models/extended-types';

/** The /v1/title/opus/player/???/details model */
export interface OpusPlayerDetails {
  xuid: bigint;
  gamertag: GamertagString;
  licensePlate: string;
  ageGroup: string;
  subscriptionTier: string;
  country: bigint;
  region: bigint;
  lcid: bigint;
  ipAddress: string;
  lastLoginUtc: Date;
  firstLoginUtc: Date;
  currentDriverModelId: bigint;
  currentPlayerTitleId: string;
  currentBadgeId: string;
  currentCareerLevel: bigint;
  acceptsClubInvites: boolean;
  clubTopTierCount: bigint;
  clubTag: string;
  roleInClub: string;
}
