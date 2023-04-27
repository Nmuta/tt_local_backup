import { Injectable } from '@angular/core';
import { GuidLikeString } from '@models/extended-types';
import { SteelheadPlayerInventory, SteelheadPlayerInventoryProfile } from '@models/steelhead';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable, of } from 'rxjs';

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

  /** Adds item to player inventory. */
  public addItemToInventory$(
    _xuid: BigNumber,
    _externalProfileId: GuidLikeString,
  ): Observable<unknown> {
    // TODO: Update once API is ready
    return of(null);
    // return this.api.postRequest$<SteelheadPlayerInventoryProfile[]>(
    //   `${this.basePath}/${xuid}/inventory/profile/${externalProfileId}`,
    //   null,
    // );
  }
}
