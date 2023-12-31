import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GuidLikeString } from '@models/extended-types';
import { SteelheadPlayerInventoryCarItem } from '@models/player-inventory-item';
import { FullPlayerInventoryProfile } from '@models/player-inventory-profile';
import { SteelheadPlayerInventory, SteelheadPlayerInventoryItem } from '@models/steelhead';
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
  public getInventoryByXuid$(
    xuid: BigNumber,
    includeClientCarInfo: boolean = true,
  ): Observable<SteelheadPlayerInventory> {
    const params = new HttpParams().set('includeClientCarInfo', includeClientCarInfo);
    return this.api.getRequest$<SteelheadPlayerInventory>(
      `${this.basePath}/${xuid}/inventory`,
      params,
    );
  }

  /** Gets user inventory by a profile ID. */
  public getInventoryByProfileId$(
    xuid: BigNumber,
    profileId: BigNumber,
    includeClientCarInfo: boolean = true,
  ): Observable<SteelheadPlayerInventory> {
    const params = new HttpParams().set('includeClientCarInfo', includeClientCarInfo);
    return this.api.getRequest$<SteelheadPlayerInventory>(
      `${this.basePath}/${xuid}/inventory/profile/${profileId}`,
      params,
    );
  }

  /** Gets specific car in user inventory by a profile id and vin. */
  public getInventoryCarByProfileId$(
    xuid: BigNumber,
    profileId: BigNumber,
    vin: GuidLikeString,
  ): Observable<SteelheadPlayerInventoryCarItem> {
    return this.api.getRequest$<SteelheadPlayerInventoryCarItem>(
      `${this.basePath}/${xuid}/inventory/profile/${profileId}/car/${vin}`,
    );
  }

  /** Gets user inventory profiles by a XUID. */
  public getInventoryProfilesByXuid$(xuid: BigNumber): Observable<FullPlayerInventoryProfile[]> {
    return this.api.getRequest$<FullPlayerInventoryProfile[]>(
      `${this.basePath}/${xuid}/inventory/profiles`,
    );
  }

  /** Edits items on player inventory. */
  public editPlayerProfileItems$(
    xuid: BigNumber,
    externalProfileId: GuidLikeString,
    inventoryUpdate: SteelheadPlayerInventory,
  ): Observable<SteelheadPlayerInventory> {
    return this.api.postRequest$<SteelheadPlayerInventory>(
      `${this.basePath}/${xuid}/inventory/externalProfileId/${externalProfileId}/items`,
      inventoryUpdate,
    );
  }

  /** Removes items from player inventory. */
  public deletePlayerProfileItems$(
    xuid: BigNumber,
    externalProfileId: GuidLikeString,
    inventoryUpdate: SteelheadPlayerInventory,
  ): Observable<SteelheadPlayerInventoryItem[]> {
    return this.api.deleteRequest$<SteelheadPlayerInventoryItem[]>(
      `${this.basePath}/${xuid}/inventory/externalProfileId/${externalProfileId}/items`,
      null,
      inventoryUpdate,
    );
  }
}
