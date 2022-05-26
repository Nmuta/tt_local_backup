import { Params } from '@angular/router';
import { tryParseBigNumber } from '@helpers/bignumbers';
import { PaginatorQueryParams } from '@helpers/paginator';
import BigNumber from 'bignumber.js';
import { DateTime } from 'luxon';
import { DeviceType } from './enums';
import { GuidLikeString } from './extended-types';

export const DEFAULT_LEADERBOARD_SCORES_MAX_RESULTS = new BigNumber(5000);
export const DEFAULT_LEADERBOARD_SCORES_NEAR_PLAYER_MAX_RESULTS = new BigNumber(20);
export const LEADERBOARD_PAGINATOR_SIZES = [25, 50, 100];

export interface LeaderboardMetadataAndQuery {
  metadata: Leaderboard;
  query: LeaderboardQuery;
}

/** Interface for a leaderboard. */
export interface UpsteamLeaderboard {
  name: string;
  gameScoreboardId: BigNumber;
  trackId: BigNumber;
  scoreboardTypeId: BigNumber;
  scoreboardType: string;
  scoreTypeId: BigNumber;
  scoreType: string;
  carClassId: BigNumber;
  carClass: string;
  validationData: LeaderboardValidationData[];
}

export interface Leaderboard extends UpsteamLeaderboard {
  /** Client-side only to track device type filters. */
  deviceTypes?: DeviceType[];
}

/** Interface for an upstream leaderboard score. */
export interface UpsteamLeaderboardScore {
  position: BigNumber;
  xuid: BigNumber;
  id: GuidLikeString;
  submissionTimeUtc: DateTime;
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
  deviceType: string;
}

/** Interface for a leaderboard score. */
export interface LeaderboardScore extends UpsteamLeaderboardScore {
  /** Multi-select */
  selected?: boolean;
  /** Highlighting specific players */
  highlighted?: boolean;
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
  deviceTypes: string;
  xuid?: BigNumber;
}

/** Interface of required params for a leaderboard query. */
export interface LeaderboardQuery extends UpstreamLeaderboardQuery {
  /** Paginator index */
  [PaginatorQueryParams.Index]?: number;
  /** Paginator size */
  [PaginatorQueryParams.Size]?: number;
}

/** Interface of required params for a leaderboard query. */
export interface LeaderboardValidationData {
  validationType: LeaderboardValidationType;
  minValue?: BigNumber;
  maxValue?: BigNumber;
  requiredCar?: BigNumber;
}

export enum LeaderboardValidationType {
  MinMax = 'MinMaxValidation',
  Car = 'CarValidation',
  Ghost = 'GhostValidation',
  Rival = 'RivalValidation',
}

/** Generates a leaderboard query based on a provided leaderboard. */
export function toLeaderboardQuery(leaderboard: Leaderboard): LeaderboardQuery {
  return {
    scoreboardTypeId: leaderboard.scoreboardTypeId,
    scoreTypeId: leaderboard.scoreTypeId,
    gameScoreboardId: leaderboard.gameScoreboardId,
    trackId: leaderboard.trackId,
    deviceTypes: leaderboard.deviceTypes.join(','),
    ps: LEADERBOARD_PAGINATOR_SIZES[0],
  };
}

/** Generates a leaderboard query based on URL query params. */
export function paramsToLeadboardQuery(params: Params): Partial<LeaderboardQuery> {
  const scoreboardTypeId = tryParseBigNumber(params['scoreboardTypeId']);
  const scoreTypeId = tryParseBigNumber(params['scoreTypeId']);
  const gameScoreboardId = tryParseBigNumber(params['gameScoreboardId']);
  const trackId = tryParseBigNumber(params['trackId']);
  const deviceTypes: string = params['deviceTypes'];

  const paginatorIndex = tryParseBigNumber(params['pi'])?.toNumber() ?? undefined;
  const paginatorSize =
    tryParseBigNumber(params['ps'])?.toNumber() ?? LEADERBOARD_PAGINATOR_SIZES[0];

  // Optional params
  const xuid = tryParseBigNumber(params['xuid']);

  return {
    scoreboardTypeId: scoreboardTypeId,
    scoreTypeId: scoreTypeId,
    gameScoreboardId: gameScoreboardId,
    trackId: trackId,
    deviceTypes: deviceTypes,
    xuid: xuid,
    pi: paginatorIndex,
    ps: paginatorSize,
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

  if (scoreTypeId.isEqualTo(LeaderboardScoreType.Laptime)) {
    return 'seconds';
  }

  return '';
}

/** Generates an leaderboard metadata overview including name, scoretype, scoreboardType, and carClass.  */
export function generateLeaderboardMetadataString(leaderboard: Leaderboard): string {
  const deviceTypes =
    leaderboard.deviceTypes.length > 0 ? leaderboard.deviceTypes.join(', ') : 'All Device Types';
  return `${leaderboard.name} ${leaderboard.scoreType} - ${deviceTypes} - ${leaderboard.scoreboardType}`;
}

/** Gets deviceTypes from leaderboard query.  */
export function getDeviceTypesFromQuery(query: LeaderboardQuery): DeviceType[] {
  const deviceTypes = query?.deviceTypes?.trim() ?? null;
  if (!deviceTypes || deviceTypes?.length <= 0) {
    return [];
  }

  return deviceTypes
    .split(',')
    .map(deviceType => DeviceType[deviceType])
    .filter(deviceType => !!deviceType);
}
