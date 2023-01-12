import { Injectable } from '@angular/core';
import { PullRequest } from '@models/git-operation';
import { WelcomeCenterTile, FriendlyNameMap } from '@models/welcome-center';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** The /v2/title/steelhead/welcomecenter/worldofforza endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadWelcomeCenterTileService {
  public readonly basePath: string = 'title/steelhead/welcomecenter/worldofforza';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets Welcome Center Tile Friendly Name list mapped to Guid. */
  public getWelcomeCenterTiles$(): Observable<FriendlyNameMap> {
    return this.api.getRequest$<FriendlyNameMap>(`${this.basePath}/options`);
  }

  /** Gets Welcome Center Tile. */
  public getWelcomeCenterTile$(welcomeCenterTileId: string): Observable<WelcomeCenterTile> {
    return this.api.getRequest$<WelcomeCenterTile>(`${this.basePath}/${welcomeCenterTileId}`);
  }

  /** Submit Welcome Center Tile modification. */
  public submitModification$(
    welcomeCenterTileId: string,
    welcomeCenterTile: WelcomeCenterTile,
  ): Observable<PullRequest> {
    return this.api.postRequest$<PullRequest>(
      `${this.basePath}/${welcomeCenterTileId}`,
      welcomeCenterTile,
    );
  }
}
