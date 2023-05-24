import { Injectable } from '@angular/core';
import { GuidLikeString } from '@models/extended-types';
import { PlayerInventoryItem } from '@models/player-inventory-item';
import { FullPlayerInventoryProfile } from '@models/player-inventory-profile';
import { SteelheadPlayerInventory } from '@models/steelhead';
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

  /** Gets user inventory by a profile ID. */
  public getInventoryByProfileId$(
    xuid: BigNumber,
    profileId: BigNumber,
  ): Observable<SteelheadPlayerInventory> {
    return this.api.getRequest$<SteelheadPlayerInventory>(
      `${this.basePath}/${xuid}/inventory/profile/${profileId}`,
    );
  }

  /** Gets user inventory profiles by a XUID. */
  public getInventoryProfilesByXuid$(xuid: BigNumber): Observable<FullPlayerInventoryProfile[]> {
    return this.api.getRequest$<FullPlayerInventoryProfile[]>(
      `${this.basePath}/${xuid}/inventory/profiles`,
    );
  }

  /** Adds item to player inventory. */
  public editPlayerProfileItems$(
    xuid: BigNumber,
    externalProfileId: GuidLikeString,
    inventoryUpdate: SteelheadPlayerInventory,
  ): Observable<PlayerInventoryItem[]> {
    return this.api.postRequest$<PlayerInventoryItem[]>(
      `${this.basePath}/${xuid}/inventory/externalProfileId/${externalProfileId}/items`,
      inventoryUpdate,
    );
  }

  /** Removes items from player inventory. */
  public deletePlayerProfileItems$(
    xuid: BigNumber,
    externalProfileId: GuidLikeString,
    inventoryUpdate: SteelheadPlayerInventory,
  ): Observable<PlayerInventoryItem[]> {
    return this.api.deleteRequest$<PlayerInventoryItem[]>(
      `${this.basePath}/${xuid}/inventory/externalProfileId/${externalProfileId}/items`,
      null,
      inventoryUpdate,
    );
  }
}
