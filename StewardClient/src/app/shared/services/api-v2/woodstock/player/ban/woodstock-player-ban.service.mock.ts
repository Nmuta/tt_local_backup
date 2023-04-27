import { Injectable, Provider } from '@angular/core';
import { Observable, of } from 'rxjs';
import { WoodstockPlayerBanService } from './woodstock-player-ban.service';

/** Defines the mock for the WoodstockPlayerBanService. */
@Injectable()
export class MockWoodstockPlayerBanService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getNextBanDuration$ = jasmine.createSpy('getNextBanDuration').and.returnValue(of([]));
}
/** Creates an injectable mock for Woodstock Players Ban Service. */
export function createMockWoodstockPlayerBanService(): Provider {
  return {
    provide: WoodstockPlayerBanService,
    useValue: new MockWoodstockPlayerBanService(),
  };
}
