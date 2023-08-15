import { Injectable, Provider } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SteelheadPlayerBanService } from './steelhead-player-ban.service';

/** Defines the mock for the SteelheadPlayerBanService. */
@Injectable()
export class MockSteelheadPlayerBanService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getNextBanDuration$ = jasmine.createSpy('getNextBanDuration').and.returnValue(of([]));
}
/** Creates an injectable mock for Steelhead Players Ban Service. */
export function createMockSteelheadPlayerBanService(): Provider {
  return {
    provide: SteelheadPlayerBanService,
    useValue: new MockSteelheadPlayerBanService(),
  };
}
