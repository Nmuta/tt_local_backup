import { Injectable } from '@angular/core';
import { throwError } from '@microsoft/applicationinsights-core-js';
import { GuidLikeString } from '@models/extended-types';
import { PlayFabBuildLock, PlayFabBuildSummary, PlayFabBuildLockRequest } from '@models/playfab';
import { WoodstockPlayFabEnvironments } from '@models/woodstock';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** The /v2/woodstock/playfab/<playfab-environment>/builds endpoints. */
@Injectable({
  providedIn: 'root',
})
export class WoodstockPlayFabBuildsService {
  public readonly basePath: string = 'title/woodstock/playfab';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets PlayFab multiplayer server builds. */
  public getBuilds$(
    playFabEnvironment: WoodstockPlayFabEnvironments,
  ): Observable<PlayFabBuildSummary[]> {
    return this.api.getRequest$<PlayFabBuildSummary[]>(
      `${this.basePath}/${playFabEnvironment}/builds`,
    );
  }

  /** Gets PlayFab multiplayer server build. */
  public getBuild$(
    playFabEnvironment: WoodstockPlayFabEnvironments,
    buildId: GuidLikeString,
  ): Observable<PlayFabBuildSummary> {
    return this.api.getRequest$<PlayFabBuildSummary>(
      `${this.basePath}/${playFabEnvironment}/builds/${buildId}`,
    );
  }

  /** Gets PlayFab build locks. */
  public getBuildLocks$(
    playFabEnvironment: WoodstockPlayFabEnvironments,
  ): Observable<PlayFabBuildLock[]> {
    return this.api.getRequest$<PlayFabBuildLock[]>(
      `${this.basePath}/${playFabEnvironment}/builds/locks`,
    );
  }

  /** Adds new PlayFab build lock. */
  public addBuildLock$(
    playFabEnvironment: WoodstockPlayFabEnvironments,
    buildLockRequest: PlayFabBuildLockRequest,
  ): Observable<PlayFabBuildLock> {
    if (!buildLockRequest.isLocked) {
      return throwError('Cannot add a new PlayFab build lock with isLocked set to false.');
    }
    return this.api.postRequest$<PlayFabBuildLock>(
      `${this.basePath}/${playFabEnvironment}/builds/${buildLockRequest.id}/lock`,
      buildLockRequest,
    );
  }

  /** Updates PlayFab build lock. */
  public updateBuildLock$(
    playFabEnvironment: WoodstockPlayFabEnvironments,
    buildLockRequest: PlayFabBuildLockRequest,
  ): Observable<void> {
    return this.api.putRequest$<void>(
      `${this.basePath}/${playFabEnvironment}/builds/${buildLockRequest.id}/lock`,
      buildLockRequest,
    );
  }

  /** Deletes PlayFab build lock. */
  public deleteBuildLock$(
    playFabEnvironment: WoodstockPlayFabEnvironments,
    buildLockId: GuidLikeString,
  ): Observable<PlayFabBuildLock> {
    return this.api.deleteRequest$<PlayFabBuildLock>(
      `${this.basePath}/${playFabEnvironment}/builds/${buildLockId}/lock`,
    );
  }
}
