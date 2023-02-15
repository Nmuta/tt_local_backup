import { Injectable } from '@angular/core';
import { PullRequest } from '@models/git-operation';
import { FriendlyNameMap, ImageTextTile, TileType } from '@models/welcome-center';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable, tap } from 'rxjs';

/** The /v2/title/steelhead/welcomecenter/worldofforza/imagetext endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadImageTextTileService {
  public readonly basePath: string = 'title/steelhead/welcomecenter/worldofforza/imagetext';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets Image Text Tile Friendly Name list mapped to Guid. */
  public getImageTextTiles$(): Observable<FriendlyNameMap> {
    return this.api.getRequest$<FriendlyNameMap>(`${this.basePath}/options`);
  }

  /** Gets an Image Text Tile. */
  public getImageTextTile$(welcomeCenterTileId: string): Observable<ImageTextTile> {
    return this.api.getRequest$<ImageTextTile>(`${this.basePath}/${welcomeCenterTileId}`).pipe(
      tap(tile => {
        tile.derivedType = TileType.ImageText;
      }),
    );
  }

  /** Submit Image Text Tile modification. */
  public submitImageTextTileModification$(
    welcomeCenterTileId: string,
    welcomeCenterTile: ImageTextTile,
  ): Observable<PullRequest> {
    return this.api.postRequest$<PullRequest>(
      `${this.basePath}/${welcomeCenterTileId}`,
      welcomeCenterTile,
    );
  }
}
