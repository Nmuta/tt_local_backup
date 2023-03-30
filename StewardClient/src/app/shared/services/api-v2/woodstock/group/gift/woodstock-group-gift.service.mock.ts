import { Injectable, Provider } from '@angular/core';
import { Observable, of } from 'rxjs';
import { WoodstockGroupGiftService } from './woodstock-group-gift.service';

/** Defines the mock for the WoodstockGroupGiftService. */
@Injectable()
export class MockWoodstockGroupGiftService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public giftLiveriesByUserGroup$ = jasmine
    .createSpy('giftLiveriesByUserGroup')
    .and.returnValue(of([]));
}
/** Creates an injectable mock for Woodstock Group Gift Service. */
export function createMockWoodstockGroupGiftService(): Provider {
  return {
    provide: WoodstockGroupGiftService,
    useValue: new MockWoodstockGroupGiftService(),
  };
}
