import { Injectable } from '@angular/core';
import { GuidLikeString } from '@models/extended-types';
import { PlayFabBuildLock, PlayFabBuildSummary } from '@models/playfab';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** The /v2/woodstock/playfab/builds endpoints. */
@Injectable({
  providedIn: 'root',
})
export class WoodstockPlayFabBuildsService {
  public readonly basePath: string = 'title/woodstock/playfab';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets PlayFab multiplayer server builds. */
  public getBuilds$(): Observable<PlayFabBuildSummary[]> {
    return this.api.getRequest$<PlayFabBuildSummary[]>(`${this.basePath}/builds`);
  }

  /** Gets PlayFab multiplayer server build. */
  public getBuild$(buildId: GuidLikeString): Observable<PlayFabBuildSummary> {
    return this.api.getRequest$<PlayFabBuildSummary>(`${this.basePath}/builds/${buildId}`);
  }

  /** Gets PlayFab build locks. */
  public getBuildLocks$(): Observable<PlayFabBuildLock[]> {
    return this.api.getRequest$<PlayFabBuildLock[]>(`${this.basePath}/builds/locks`);
  }

  /** Adds new PlayFab build lock. */
  public addBuildLock$(buildLockId: GuidLikeString, reason: string): Observable<PlayFabBuildLock> {
    return this.api.postRequest$<PlayFabBuildLock>(
      `${this.basePath}/builds/${buildLockId}/lock`,
      reason,
    );
  }

  /** Deletes PlayFab build lock. */
  public deleteBuildLock$(buildLockId: GuidLikeString): Observable<PlayFabBuildLock> {
    return this.api.deleteRequest$<PlayFabBuildLock>(`${this.basePath}/builds/${buildLockId}/lock`);
  }
}
