import { Injectable } from '@angular/core';
import { GuidLikeString } from '@models/extended-types';
import { WoodstockPlayerUgcItem } from '@models/player-ugc-item';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** The /v2/title/woodstock/items endpoints. */
@Injectable({
  providedIn: 'root',
})
export class WoodstockStorefrontService {
  public readonly basePath: string = 'title/woodstock/storefront';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets a layer group UGC item. */
  public getLayerGroup$(id: GuidLikeString): Observable<WoodstockPlayerUgcItem> {
    return this.api.getRequest$<WoodstockPlayerUgcItem>(`${this.basePath}/layergroup/${id}`);
  }
}
