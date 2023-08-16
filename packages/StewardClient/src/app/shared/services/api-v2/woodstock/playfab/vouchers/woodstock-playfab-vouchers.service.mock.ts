import { ValueProvider } from '@angular/core';
import { Observable, of } from 'rxjs';
import { WoodstockPlayFabVouchersService } from './woodstock-playfab-vouchers.service';

/** Defines the mock for the Woodstock PlayFab Vouchers API Service. */
export class MockWoodstockPlayFabVouchersService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);
}

/** Creates an injectable mock for Woodstock PlayFab Vouchers Service. */
export function createMockWoodstockPlayFabVouchersService(): ValueProvider {
  return {
    provide: WoodstockPlayFabVouchersService,
    useValue: new MockWoodstockPlayFabVouchersService(),
  };
}
