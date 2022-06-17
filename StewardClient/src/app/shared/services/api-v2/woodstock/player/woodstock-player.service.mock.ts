import { Injectable, Provider } from '@angular/core';
import { Observable, of } from 'rxjs';

import { WoodstockPlayerService } from './woodstock-player.service';

/** Defines the mock for the WoodstockPlayerService. */
@Injectable()
export class MockWoodstockPlayerService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getUserReportWeight$ = jasmine.createSpy('getUserReportWeight').and.returnValue(of(0));

  public setUserReportWeight$ = jasmine.createSpy('setUserReportWeight').and.returnValue(of());
}
/** Creates an injectable mock for Woodstock Player Service. */
export function createMockWoodstockPlayerService(): Provider {
  return {
    provide: WoodstockPlayerService,
    useValue: new MockWoodstockPlayerService(),
  };
}
