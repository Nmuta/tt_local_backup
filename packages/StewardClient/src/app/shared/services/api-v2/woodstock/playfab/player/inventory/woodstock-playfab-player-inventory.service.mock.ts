import { ValueProvider } from '@angular/core';
import { Observable, of } from 'rxjs';
import { WoodstockPlayFabPlayerInventoryService } from './woodstock-playfab-player-inventory.service';

/** Defines the mock for the Woodstock PlayFab PlayerInventory API Service. */
export class MockWoodstockPlayFabPlayerInventoryService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);
}

/** Creates an injectable mock for Woodstock PlayFab PlayerInventory Service. */
export function createMockWoodstockPlayFabPlayerInventoryService(): ValueProvider {
  return {
    provide: WoodstockPlayFabPlayerInventoryService,
    useValue: new MockWoodstockPlayFabPlayerInventoryService(),
  };
}
