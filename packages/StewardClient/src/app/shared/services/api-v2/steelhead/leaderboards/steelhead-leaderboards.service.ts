import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { addQueryParamArray } from '@helpers/add-query-param-array';
import { overrideSteelheadEndpointKey } from '@helpers/override-endpoint-key';
import { DeviceType } from '@models/enums';
import { GuidLikeString } from '@models/extended-types';
import { IdentityResultAlphaBatch } from '@models/identity-query.model';
import {
  DEFAULT_LEADERBOARD_SCORES_MAX_RESULTS,
  DEFAULT_LEADERBOARD_SCORES_NEAR_PLAYER_MAX_RESULTS,
  Leaderboard,
  LeaderboardScore,
} from '@models/leaderboards';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** The /v2/title/steelhead/leaderboards endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadLeaderboardsService {
  public readonly basePath: string = 'title/steelhead/leaderboards';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets leaderboards. */
  public getLeaderboards$(pegasusEnvironment: string): Observable<Leaderboard[]> {
    const params = new HttpParams().set('pegasusEnvironment', pegasusEnvironment);

    return this.api.getRequest$<Leaderboard[]>(`${this.basePath}`, params);
  }

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
      headers = overrideSteelheadEndpointKey(endpointKeyOverride, headers);
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
      headers = overrideSteelheadEndpointKey(endpointKeyOverride, headers);
    }

    return this.api.getRequest$<LeaderboardScore[]>(
      `${this.basePath}/scores/near-player/${xuid}`,
      params,
      headers,
    );
  }

  /** Gets leaderboard talent identities. */
  public getLeaderboardTalentIdentities$(): Observable<IdentityResultAlphaBatch> {
    return this.api.getRequest$<IdentityResultAlphaBatch>(`${this.basePath}/talent`);
  }

  /** Deletes leaderboard scores. */
  public deleteLeaderboardScores$(
    scoreIds: GuidLikeString[],
    endpointKeyOverride?: string,
  ): Observable<void> {
    let headers = new HttpHeaders();
    if (!!endpointKeyOverride) {
      headers = overrideSteelheadEndpointKey(endpointKeyOverride, headers);
    }

    return this.api.postRequest$<void>(
      `${this.basePath}/scores/delete`,
      scoreIds,
      undefined,
      headers,
    );
  }
}
