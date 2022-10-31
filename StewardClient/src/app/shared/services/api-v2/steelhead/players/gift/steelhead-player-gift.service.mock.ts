import { Injectable, Provider } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SteelheadPlayersGiftService } from './steelhead-players-gift.service';

/** Defines the mock for the SteelheadPlayerGiftService. */
@Injectable()
export class MockSteelheadPlayerGiftService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public postGiftPlayersUsingBackgroundTask$ = jasmine
    .createSpy('postGiftPlayersUsingBackgroundTask')
    .and.returnValue(of(null));

  public giftLiveriesByXuids$ = jasmine.createSpy('giftLiveriesByXuids').and.returnValue(of(0));
}
/** Creates an injectable mock for Steelhead Player Gift Service. */
export function createMockSteelheadPlayersGiftService(): Provider {
  return {
    provide: SteelheadPlayersGiftService,
    useValue: new MockSteelheadPlayerGiftService(),
  };
}
