import { Injectable } from '@angular/core';
import { SteelheadPlayerInventory, SteelheadPlayerInventoryProfile } from '@models/steelhead';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** The /v2/title/steelhead/player/{xuid}/inventory endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadPlayerInventoryService {
  public readonly basePath: string = 'title/steelhead/player';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets user inventory by a XUID. */
  public getInventoryByXuid$(xuid: BigNumber): Observable<SteelheadPlayerInventory> {
    return this.api.getRequest$<SteelheadPlayerInventory>(`${this.basePath}/${xuid}/inventory`);
  }

  /** Gets user inventory profiles by a XUID. */
  public getInventoryProfilesByXuid$(
    xuid: BigNumber,
  ): Observable<SteelheadPlayerInventoryProfile[]> {
    return this.api.getRequest$<SteelheadPlayerInventoryProfile[]>(
      `${this.basePath}/${xuid}/inventory/profiles`,
    );
  }
}
