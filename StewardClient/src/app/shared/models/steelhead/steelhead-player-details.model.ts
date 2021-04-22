import BigNumber from 'bignumber.js';
import { GamertagString } from '@models/extended-types';

/** The /v1/title/steelhead/player/???/details model */
export interface SteelheadPlayerDetails {
  xuid: BigNumber;
  gamertag: GamertagString;
  currentProfileId: BigNumber;
  subscriptionTier: string;
  ageGroup: string;
  country: BigNumber;
  region: BigNumber;
  lcid: BigNumber;
  ipAddress: string;
  lastLoginUtc: Date;
  firstLoginUtc: Date;
  currentDriverModelId: BigNumber;
  currentPlayerTitleId: string;
  currentBadgeId: string;
  clubTag: string;
  clubId: string;
  roleInClub: string;
  currentCareerLevel: BigNumber;
  equippedVanityItemId: BigNumber;
  currentCarCollectionTier: string;
  currentCarCollectionScore: BigNumber;
}
