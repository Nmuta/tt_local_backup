import { Injectable } from '@angular/core';
import { WoodstockMasterInventory } from '@models/woodstock';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** The /v2/title/woodstock/items endpoints. */
@Injectable({
  providedIn: 'root',
})
export class WoodstockItemsService {
  public readonly basePath: string = 'title/woodstock/items';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets the Woodstock master inventory. */
  public getMasterInventory$(): Observable<WoodstockMasterInventory> {
    return this.api.getRequest$<WoodstockMasterInventory>(this.basePath);
  }
}
