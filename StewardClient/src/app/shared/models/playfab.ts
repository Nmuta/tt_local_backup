import { GuidLikeString } from '@models/extended-types';
import { DateTime } from 'luxon';

/** PlayFab multiplayer server build summary. */
export interface PlayFabBuildSummary {
  // API response also includes meta and region data that isn't used yet
  id: GuidLikeString;
  name: string;
  creationDateUtc?: DateTime;
}

/** PlayFab multiplayer server build lock. */
export interface PlayFabBuildLock {
  id: GuidLikeString;
  reason: string;
  isLocked: boolean;
  userId: string;
  playFabEnvironment: string;
  gameTitle: string;
  dateCreatedUtc: DateTime;
  metaData: string;
}

/** Model used for creating and updating PlayFab build locks. */
export interface PlayFabBuildLockRequest {
  id: GuidLikeString;
  reason: string;
  isLocked: boolean;
}
