import { Injectable, Provider } from '@angular/core';
import { Observable, of } from 'rxjs';
import { WoodstockPlayersGiftService } from './woodstock-players-gift.service';

/** Defines the mock for the WoodstockPlayerGiftService. */
@Injectable()
export class MockWoodstockPlayerGiftService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public giftLiveriesByXuids$ = jasmine.createSpy('giftLiveriesByXuids').and.returnValue(of(0));
}
/** Creates an injectable mock for Woodstock Player Gift Service. */
export function createMockWoodstockPlayersGiftService(): Provider {
  return {
    provide: WoodstockPlayersGiftService,
    useValue: new MockWoodstockPlayerGiftService(),
  };
}
