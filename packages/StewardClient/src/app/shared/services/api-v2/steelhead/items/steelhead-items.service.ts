import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SimpleCar } from '@models/cars';
import { PegasusProjectionSlot } from '@models/enums';
import { SteelheadMasterInventory } from '@models/steelhead';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** The /v2/title/steelhead/items endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadItemsService {
  public readonly basePath: string = 'title/steelhead/items';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets the Steelhead master inventory. */
  public getMasterInventory$(): Observable<SteelheadMasterInventory> {
    return this.api.getRequest$<SteelheadMasterInventory>(this.basePath);
  }

  /** Gets the Steelhead detailed car list. */
  public getSimpleCars$(pegasusSlotId?: PegasusProjectionSlot): Observable<SimpleCar[]> {
    let params = new HttpParams();
    if (!!pegasusSlotId) {
      params = params.set('slotId', pegasusSlotId);
    }

    return this.api.getRequest$<SimpleCar[]>(`${this.basePath}/cars`, params);
  }
}
