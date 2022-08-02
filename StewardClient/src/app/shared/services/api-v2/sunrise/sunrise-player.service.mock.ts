import { Injectable, Provider } from '@angular/core';
import { Observable, of } from 'rxjs';

import { SunrisePlayerService } from './sunrise-player.service';

/** Defines the mock for the SunrisePlayerService. */
@Injectable()
export class MockSunrisePlayerService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getProfileRollbackHistoryXuid$ = jasmine
    .createSpy('getProfileRollbackHistoryXuid')
    .and.returnValue(of([]));
}
/** Creates an injectable mock for Sunrise Player Service. */
export function createMockSunrisePlayerService(): Provider {
  return {
    provide: SunrisePlayerService,
    useValue: new MockSunrisePlayerService(),
  };
}
