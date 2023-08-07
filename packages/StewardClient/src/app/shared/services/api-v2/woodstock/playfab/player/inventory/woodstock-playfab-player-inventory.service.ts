import { Injectable } from '@angular/core';
import { GuidLikeString } from '@models/extended-types';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** Represents a PlayFab inventory change request. */
export interface PlayFabInventoryChangeRequest {
  itemId: string;
  amount: number;
}

/** Represents a PlayFab inventory item. */
export interface PlayFabInventoryItem {
  amount: number;
  id: string;
  stackId: string;
  type: string;
  displayProperties?: unknown; // Leaving as until property is needed in UI
}

/** The /v2/woodstock/playfab/player/<player-title-entity-id>/player-inventory endpoints. */
@Injectable({
  providedIn: 'root',
})
export class WoodstockPlayFabPlayerInventoryService {
  public readonly basePath: string = 'title/woodstock/playfab/player';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets PlayFab player inventory. */
  public getInventory$(playfabTitleEntityId: string): Observable<PlayFabInventoryItem[]> {
    return this.api.getRequest$<PlayFabInventoryItem[]>(
      `${this.basePath}/${playfabTitleEntityId}/inventory`,
    );
  }

  /** Adds item to PlayFab player inventory. */
  public addItem$(
    playfabTitleEntityId: string,
    itemId: GuidLikeString,
    amountToAdd: number,
  ): Observable<void> {
    return this.api.postRequest$<void>(`${this.basePath}/${playfabTitleEntityId}/inventory/add`, {
      itemId: itemId,
      amount: amountToAdd,
    } as PlayFabInventoryChangeRequest);
  }

  /** Removes item from PlayFab player inventory. */
  public removeItem$(
    playfabTitleEntityId: string,
    itemId: GuidLikeString,
    amountToRemove: number,
  ): Observable<void> {
    return this.api.postRequest$<void>(
      `${this.basePath}/${playfabTitleEntityId}/inventory/remove`,
      {
        itemId: itemId,
        amount: amountToRemove,
      } as PlayFabInventoryChangeRequest,
    );
  }
}
