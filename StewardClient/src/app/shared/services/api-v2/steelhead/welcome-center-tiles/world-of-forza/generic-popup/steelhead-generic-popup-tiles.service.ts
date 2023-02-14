import { Injectable } from '@angular/core';
import { PullRequest } from '@models/git-operation';
import { FriendlyNameMap, GenericPopupTile, TileType } from '@models/welcome-center';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable, tap } from 'rxjs';

/** The /v2/title/steelhead/welcomecenter/worldofforza/genericpopup endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadGenericPopupTileService {
  public readonly basePath: string = 'title/steelhead/welcomecenter/worldofforza/genericpopup';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets Generic Popup Tile Friendly Name list mapped to Guid. */
  public getGenericPopupTiles$(): Observable<FriendlyNameMap> {
    return this.api.getRequest$<FriendlyNameMap>(`${this.basePath}/options`);
  }

  /** Gets a Generic Popup Tile. */
  public getGenericPopupTile$(welcomeCenterTileId: string): Observable<GenericPopupTile> {
    return this.api.getRequest$<GenericPopupTile>(`${this.basePath}/${welcomeCenterTileId}`).pipe(
      tap(tile => {
        tile.derivedType = TileType.GenericPopup;
      }),
    );
  }

  /** Submit Generic Popup Tile modification. */
  public submitGenericPopupTileModification$(
    welcomeCenterTileId: string,
    welcomeCenterTile: GenericPopupTile,
  ): Observable<PullRequest> {
    return this.api.postRequest$<PullRequest>(
      `${this.basePath}/${welcomeCenterTileId}`,
      welcomeCenterTile,
    );
  }
}
