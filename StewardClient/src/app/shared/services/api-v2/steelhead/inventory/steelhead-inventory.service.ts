import { Injectable } from '@angular/core';
import { SteelheadPlayerInventory } from '@models/steelhead';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** The /v2/title/steelhead/inventory/{profileId} endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadInventoryService {
  public readonly basePath: string = 'title/steelhead/inventory';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets user inventory by a profile ID. */
  public getInventoryByProfileId$(profileId: BigNumber): Observable<SteelheadPlayerInventory> {
    return this.api.getRequest$<SteelheadPlayerInventory>(`${this.basePath}/${profileId}`);
  }
}
