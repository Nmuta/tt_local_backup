import { Injectable, Provider } from '@angular/core';
import { Observable, of } from 'rxjs';

import { WoodstockPlayerNotificationsService } from './woodstock-player-notifications.service';

/** Defines the mock for the WoodstockPlayerNotificationsService. */
@Injectable()
export class MockWoodstockPlayerNotificationsService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public deleteAllPlayerNotifications$ = jasmine
    .createSpy('deleteAllPlayerNotifications')
    .and.returnValue(of());
}
/** Creates an injectable mock for Woodstock Notifications Service. */
export function createMockWoodstockPlayerNotificationsService(): Provider {
  return {
    provide: WoodstockPlayerNotificationsService,
    useValue: new MockWoodstockPlayerNotificationsService(),
  };
}
