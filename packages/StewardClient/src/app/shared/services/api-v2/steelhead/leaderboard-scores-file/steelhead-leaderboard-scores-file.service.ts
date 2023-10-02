import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BackgroundJob } from '@models/background-job';
import { Leaderboard } from '@models/leaderboards';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';

export interface BlobFileInfo {
  lastModifiedUtc: DateTime;
  exists: boolean;
}

/** The /v2/title/steelhead/leaderboards/scores/file endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadLeaderboardScoresFileService {
  public readonly basePath: string = 'title/steelhead/leaderboards/scores/file';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets leaderboards. */
  public getLeaderboards$(pegasusEnvironment: string): Observable<Leaderboard[]> {
    const params = new HttpParams().set('pegasusEnvironment', pegasusEnvironment);

    return this.api.getRequest$<Leaderboard[]>(`${this.basePath}`, params);
  }

  /** Generates leaderboard scores file. */
  public generateLeaderboardScoresFile$(
    scoreboardTypeId: BigNumber,
    scoreTypeId: BigNumber,
    trackId: BigNumber,
    pivotId: BigNumber,
    pegasusEnvironment: string,
  ): Observable<BackgroundJob<void>> {
    const params = new HttpParams()
      .set('scoreboardType', scoreboardTypeId.toString())
      .set('scoreType', scoreTypeId.toString())
      .set('trackId', trackId.toString())
      .set('pivotId', pivotId.toString())
      .set('pegasusEnvironment', pegasusEnvironment);

    return this.api.postRequest$<BackgroundJob<void>>(`${this.basePath}/generate`, null, params);
  }

  /** Retrieve leaderboard scores file. */
  public retrieveLeaderboardScoresFile$(
    scoreboardTypeId: BigNumber,
    scoreTypeId: BigNumber,
    trackId: BigNumber,
    pivotId: BigNumber,
    pegasusEnvironment: string,
  ): Observable<string> {
    const params = new HttpParams()
      .set('scoreboardType', scoreboardTypeId.toString())
      .set('scoreType', scoreTypeId.toString())
      .set('trackId', trackId.toString())
      .set('pivotId', pivotId.toString())
      .set('pegasusEnvironment', pegasusEnvironment);

    return this.api.getRequest$<string>(`${this.basePath}/retrieve`, params);
  }

  /** Get leaderboard scores file metadata. */
  public getLeaderboardScoresFileMetadata$(
    scoreboardTypeId: BigNumber,
    scoreTypeId: BigNumber,
    trackId: BigNumber,
    pivotId: BigNumber,
    pegasusEnvironment: string,
  ): Observable<BlobFileInfo> {
    const params = new HttpParams()
      .set('scoreboardType', scoreboardTypeId.toString())
      .set('scoreType', scoreTypeId.toString())
      .set('trackId', trackId.toString())
      .set('pivotId', pivotId.toString())
      .set('pegasusEnvironment', pegasusEnvironment);

    return this.api.getRequest$<BlobFileInfo>(`${this.basePath}/metadata`, params);
  }
}
