import { Params } from '@angular/router';
import { tryParseBigNumber } from '@helpers/bignumbers';
import BigNumber from 'bignumber.js';
import { DateTime } from 'luxon';
import { GuidLikeString } from './extended-types';

export const DEFAULT_LEADERBOARD_SCORES_MAX_RESULTS = new BigNumber(5000);
export const DEFAULT_LEADERBOARD_SCORES_NEAR_PLAYER_MAX_RESULTS = new BigNumber(20);

/** Interface for a leaderboard. */
export interface Leaderboard {
  name: string;
  gameScoreboardId: BigNumber;
  trackId: BigNumber;
  scoreboardTypeId: BigNumber;
  scoreboardType: string;
  scoreTypeId: BigNumber;
  scoreType: string;
  carClassId: BigNumber;
  carClass: string;
}

/** Interface for an upstream leaderboard score. */
export interface UpsteamLeaderboardScore {
  position: BigNumber;
  xuid: BigNumber;
  id: GuidLikeString;
  submissionTime: DateTime;
  score: BigNumber;
  carClass: string;
  carPerformanceIndex: BigNumber;
  car: string;
  carDriveType: string;
  track: string;
  isClean: boolean;
  stabilityManagement: boolean;
  antiLockBrakingSystem: boolean;
  tractionControlSystem: boolean;
  automaticTransmission: boolean;
}

/** Interface for a leaderboard score. */
export interface LeaderboardScore extends UpsteamLeaderboardScore {
  selected?: boolean; // Multi-select
  highlighted?: boolean; // Highlighting specific players
}

/** List of known score types. */
export enum LeaderboardScoreType {
  FreeRoamPoints = 20,
  BucketListBiggerIsBetter = 13,
  BucketListSmallerIsBetter = 14,
  XP = 4,
  Laptime = 1,
  AverageSpeedZone = 6,
  DangerSign = 18,
  DriftZone = 19,
  SpeedTrap = 5,
  TrailblazerStunt = 34,
}

/** Interface of required params for a leaderboard query. */
export interface UpstreamLeaderboardQuery {
  scoreboardTypeId: BigNumber;
  scoreTypeId: BigNumber;
  gameScoreboardId: BigNumber;
  trackId: BigNumber;
  xuid?: BigNumber;
}

/** Interface of required params for a leaderboard query. */
export interface LeaderboardQuery extends UpstreamLeaderboardQuery {
  retainPaginatorIndex?: number;
}

/** Generates a leaderboard query based on a provided leaderboard. */
export function toLeaderboardQuery(leaderboard: Leaderboard): LeaderboardQuery {
  return {
    scoreboardTypeId: leaderboard.scoreboardTypeId,
    scoreTypeId: leaderboard.scoreTypeId,
    gameScoreboardId: leaderboard.gameScoreboardId,
    trackId: leaderboard.trackId,
  };
}

/** Generates a leaderboard query based on URL query params. */
export function paramsToLeadboardQuery(params: Params): Partial<LeaderboardQuery> {
  const scoreboardTypeId = tryParseBigNumber(params['scoreboardTypeId']);
  const scoreTypeId = tryParseBigNumber(params['scoreTypeId']);
  const gameScoreboardId = tryParseBigNumber(params['gameScoreboardId']);
  const trackId = tryParseBigNumber(params['trackId']);

  // Optional params
  const xuid = tryParseBigNumber(params['xuid']);

  return {
    scoreboardTypeId: scoreboardTypeId,
    scoreTypeId: scoreTypeId,
    gameScoreboardId: gameScoreboardId,
    trackId: trackId,
    xuid: xuid,
  } as LeaderboardQuery;
}

/** Returns true is provided query is a valid leaderboard query. */
export function isValidLeaderboardQuery(
  query: Partial<LeaderboardQuery>,
): query is LeaderboardQuery {
  return (
    !!query?.scoreboardTypeId &&
    !!query?.scoreTypeId &&
    !!query?.gameScoreboardId &&
    !!query?.trackId
  );
}

export function determineScoreTypeQualifier(scoreTypeId: BigNumber): string {
  if (
    scoreTypeId.isEqualTo(LeaderboardScoreType.AverageSpeedZone) ||
    scoreTypeId.isEqualTo(LeaderboardScoreType.SpeedTrap)
  ) {
    return 'mph';
  }

  if (scoreTypeId.isEqualTo(LeaderboardScoreType.DangerSign)) {
    return 'feet';
  }

  if (scoreTypeId.isEqualTo(LeaderboardScoreType.DriftZone)) {
    return 'points';
  }

  return '';
}
