import { ValueProvider } from '@angular/core';
import { Observable, of } from 'rxjs';
import { WoodstockPlayFabPlayerTransactionsService } from './woodstock-playfab-player-transactions.service';

/** Defines the mock for the Woodstock PlayFab PlayerTransactions API Service. */
export class MockWoodstockPlayFabPlayerTransactionsService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);
}

/** Creates an injectable mock for Woodstock PlayFab PlayerTransactions Service. */
export function createMockWoodstockPlayFabPlayerTransactionsService(): ValueProvider {
  return {
    provide: WoodstockPlayFabPlayerTransactionsService,
    useValue: new MockWoodstockPlayFabPlayerTransactionsService(),
  };
}
