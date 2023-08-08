import { Injectable } from '@angular/core';
import { GuidLikeString } from '@models/extended-types';
import {
  PlayFabInventoryItem,
  PlayFabTransaction,
  PlayFabInventoryChangeRequest,
  PlayFabCollectionId,
} from '@models/playfab';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** The /v2/woodstock/playfab/player/<player-title-entity-id>/player-inventory endpoints. */
@Injectable({
  providedIn: 'root',
})
export class WoodstockPlayFabPlayerInventoryService {
  public readonly basePath: string = 'title/woodstock/playfab/player';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets PlayFab player inventory. */
  public getCurrencyInventory$(
    playfabTitleEntityId: string,
    collectionId: PlayFabCollectionId,
  ): Observable<PlayFabInventoryItem[]> {
    return this.api.getRequest$<PlayFabInventoryItem[]>(
      `${this.basePath}/${playfabTitleEntityId}/inventory/${collectionId}/currency`,
    );
  }

  /** Gets PlayFab player transaction history. */
  public getTransactionHistory$(
    playfabTitleEntityId: string,
    collectionId: PlayFabCollectionId,
  ): Observable<PlayFabTransaction[]> {
    return this.api.getRequest$<PlayFabTransaction[]>(
      `${this.basePath}/${playfabTitleEntityId}/inventory/${collectionId}/transactions`,
    );
  }

  /** Adds item to PlayFab player inventory. */
  public addItem$(
    playfabTitleEntityId: string,
    collectionId: PlayFabCollectionId,
    itemId: GuidLikeString,
    amountToAdd: number,
  ): Observable<void> {
    return this.api.postRequest$<void>(
      `${this.basePath}/${playfabTitleEntityId}/inventory/${collectionId}/add`,
      {
        itemId: itemId,
        amount: amountToAdd,
      } as PlayFabInventoryChangeRequest,
    );
  }

  /** Removes item from PlayFab player inventory. */
  public removeItem$(
    playfabTitleEntityId: string,
    collectionId: PlayFabCollectionId,
    itemId: GuidLikeString,
    amountToRemove: number,
  ): Observable<void> {
    return this.api.postRequest$<void>(
      `${this.basePath}/${playfabTitleEntityId}/inventory/${collectionId}/remove`,
      {
        itemId: itemId,
        amount: amountToRemove,
      } as PlayFabInventoryChangeRequest,
    );
  }
}
