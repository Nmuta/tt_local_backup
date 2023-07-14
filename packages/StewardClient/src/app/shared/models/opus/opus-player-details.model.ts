import BigNumber from 'bignumber.js';
import { GamertagString } from '@models/extended-types';
import { DateTime } from 'luxon';

/** The /v1/title/opus/player/???/details model */
export interface OpusPlayerDetails {
  xuid: BigNumber;
  gamertag: GamertagString;
  licensePlate: string;
  ageGroup: string;
  subscriptionTier: string;
  country: BigNumber;
  region: BigNumber;
  lcid: BigNumber;
  ipAddress: string;
  lastLoginUtc: DateTime;
  firstLoginUtc: DateTime;
  currentDriverModelId: BigNumber;
  currentPlayerTitleId: string;
  currentBadgeId: string;
  currentCareerLevel: BigNumber;
  acceptsClubInvites: boolean;
  clubTopTierCount: BigNumber;
  clubTag: string;
  roleInClub: string;
}
