import { Injectable } from '@angular/core';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';

/** Represents a PlayFab transaction. */
export interface PlayFabTransaction {
  itemType: string;
  operations: PlayFabTransactionOperation[];
  operationType: string;
  purchaseDetails: unknown; // Returned by API, leaving unknown unless we need it
  redeemDetails: unknown; // Returned by API, leaving unknown unless we need it
  timestampUtc: DateTime;
  transactionId: string;
  transferDetails: unknown; // Returned by API, leaving unknown unless we need it
}

/** Represents a PlayFab transaction operation. */
export interface PlayFabTransactionOperation {
  amount?: number;
  itemId: string;
  itemType: string;
  stackId: string;
  type: string;
}

/** The /v2/woodstock/playfab/player/<player-title-entity-id>/transactions endpoints. */
@Injectable({
  providedIn: 'root',
})
export class WoodstockPlayFabPlayerTransactionsService {
  public readonly basePath: string = 'title/woodstock/playfab/player';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets PlayFab player transaction history. */
  public getHistory$(playfabTitleEntityId: string): Observable<PlayFabTransaction[]> {
    return this.api.getRequest$<PlayFabTransaction[]>(
      `${this.basePath}/${playfabTitleEntityId}/transactions`,
    );
  }
}
