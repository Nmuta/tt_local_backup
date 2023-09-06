import { Injectable, Provider } from '@angular/core';
import { Subject, of } from 'rxjs';
import { NotificationsService } from './notifications.service';
import { BackgroundJob } from '@models/background-job';

/** Defines the mock for the Background Job Service. */
@Injectable()
export class MockNotificationsService {
  public waitUntil$ = of();
  public notifications$: Subject<BackgroundJob<unknown>[]> = new Subject<
    BackgroundJob<unknown>[]
  >();
}

/** Creates an injectable mock for Notifications Service. */
export function createMockNotificationsService(): Provider {
  return { provide: NotificationsService, useValue: new MockNotificationsService() };
}
