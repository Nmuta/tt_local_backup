import { Injectable, Provider } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SteelheadGroupGiftService } from './steelhead-group-gift.service';

/** Defines the mock for the SteelheadGroupGiftService. */
@Injectable()
export class MockSteelheadGroupGiftService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public postGiftLspGroup$ = jasmine.createSpy('postGiftLspGroup').and.returnValue(of(null));

  public giftLiveriesByUserGroup$ = jasmine
    .createSpy('giftLiveriesByUserGroup')
    .and.returnValue(of([]));
}
/** Creates an injectable mock for Steelhead Group Gift Service. */
export function createMockSteelheadGroupGiftService(): Provider {
  return {
    provide: SteelheadGroupGiftService,
    useValue: new MockSteelheadGroupGiftService(),
  };
}
