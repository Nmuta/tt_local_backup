import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { addQueryParamArray } from '@helpers/add-query-param-array';
import { overrideWoodstockEndpointKey } from '@helpers/override-endpoint-key';
import { DeviceType } from '@models/enums';
import { GuidLikeString } from '@models/extended-types';
import {
  DEFAULT_LEADERBOARD_SCORES_MAX_RESULTS,
  DEFAULT_LEADERBOARD_SCORES_NEAR_PLAYER_MAX_RESULTS,
  Leaderboard,
  LeaderboardScore,
} from '@models/leaderboards';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** The /v2/title/woodstock/leaderboard endpoints. */
@Injectable({
  providedIn: 'root',
})
export class WoodstockLeaderboardService {
  public readonly basePath: string = 'title/woodstock/leaderboard';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets leaderboard metadata. */
  public getLeaderboardMetadata$(
    scoreboardTypeId: BigNumber,
    scoreTypeId: BigNumber,
    trackId: BigNumber,
    pivotId: BigNumber,
    pegasusEnvironment: string,
  ): Observable<Leaderboard> {
    const params = new HttpParams()
      .set('scoreboardType', scoreboardTypeId.toString())
      .set('scoreType', scoreTypeId.toString())
      .set('trackId', trackId.toString())
      .set('pivotId', pivotId.toString())
      .set('pegasusEnvironment', pegasusEnvironment);

    return this.api.getRequest$<Leaderboard>(`${this.basePath}/metadata`, params);
  }

  /** Gets leaderboard scores. */
  public getLeaderboardScores$(
    scoreboardTypeId: BigNumber,
    scoreTypeId: BigNumber,
    trackId: BigNumber,
    pivotId: BigNumber,
    deviceTypes: DeviceType[],
    startAt: BigNumber,
    maxResults: BigNumber = new BigNumber(DEFAULT_LEADERBOARD_SCORES_MAX_RESULTS),
    endpointKeyOverride?: string,
  ): Observable<LeaderboardScore[]> {
    let params = new HttpParams()
      .set('scoreboardType', scoreboardTypeId.toString())
      .set('scoreType', scoreTypeId.toString())
      .set('trackId', trackId.toString())
      .set('pivotId', pivotId.toString())
      .set('startAt', startAt.toString())
      .set('maxResults', maxResults.toString());
    params = addQueryParamArray(params, 'deviceTypes', deviceTypes);

    let headers = new HttpHeaders();
    if (!!endpointKeyOverride) {
      headers = overrideWoodstockEndpointKey(endpointKeyOverride, headers);
    }

    return this.api.getRequest$<LeaderboardScore[]>(`${this.basePath}/scores/top`, params, headers);
  }

  /** Gets leaderboard scores. */
  public getLeaderboardScoresNearPlayer$(
    xuid: BigNumber,
    scoreboardTypeId: BigNumber,
    scoreTypeId: BigNumber,
    trackId: BigNumber,
    pivotId: BigNumber,
    deviceTypes: DeviceType[],
    maxResults: BigNumber = new BigNumber(DEFAULT_LEADERBOARD_SCORES_NEAR_PLAYER_MAX_RESULTS),
    endpointKeyOverride?: string,
  ): Observable<LeaderboardScore[]> {
    let params = new HttpParams()
      .set('scoreboardType', scoreboardTypeId.toString())
      .set('scoreType', scoreTypeId.toString())
      .set('trackId', trackId.toString())
      .set('pivotId', pivotId.toString())
      .set('maxResults', maxResults.toString());
    params = addQueryParamArray(params, 'deviceTypes', deviceTypes);

    let headers = new HttpHeaders();
    if (!!endpointKeyOverride) {
      headers = overrideWoodstockEndpointKey(endpointKeyOverride, headers);
    }

    return this.api.getRequest$<LeaderboardScore[]>(
      `${this.basePath}/scores/near-player/${xuid}`,
      params,
      headers,
    );
  }

  /** Deletes leaderboard scores. */
  public deleteLeaderboardScores$(
    scoreIds: GuidLikeString[],
    endpointKeyOverride?: string,
  ): Observable<void> {
    let headers = new HttpHeaders();
    if (!!endpointKeyOverride) {
      headers = overrideWoodstockEndpointKey(endpointKeyOverride, headers);
    }

    return this.api.postRequest$<void>(
      `${this.basePath}/scores/delete`,
      scoreIds,
      undefined,
      headers,
    );
  }
}
