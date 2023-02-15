import { Injectable } from '@angular/core';
import { PullRequest } from '@models/git-operation';
import { FriendlyNameMap, DeeplinkTile, TileType } from '@models/welcome-center';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable, tap } from 'rxjs';

/** The /v2/title/steelhead/welcomecenter/worldofforza endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadDeeplinkTileService {
  public readonly basePath: string = 'title/steelhead/welcomecenter/worldofforza/deeplink';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets Deeplink Tile Friendly Name list mapped to Guid. */
  public getDeeplinkTiles$(): Observable<FriendlyNameMap> {
    return this.api.getRequest$<FriendlyNameMap>(`${this.basePath}/options`);
  }

  /** Gets a Deeplink Tile. */
  public getDeeplinkTile$(welcomeCenterTileId: string): Observable<DeeplinkTile> {
    return this.api.getRequest$<DeeplinkTile>(`${this.basePath}/${welcomeCenterTileId}`).pipe(
      tap(tile => {
        tile.derivedType = TileType.Deeplink;
      }),
    );
  }

  /** Submit Deeplink Tile modification. */
  public submitDeeplinkTileModification$(
    welcomeCenterTileId: string,
    welcomeCenterTile: DeeplinkTile,
  ): Observable<PullRequest> {
    return this.api.postRequest$<PullRequest>(
      `${this.basePath}/${welcomeCenterTileId}`,
      welcomeCenterTile,
    );
  }
}
