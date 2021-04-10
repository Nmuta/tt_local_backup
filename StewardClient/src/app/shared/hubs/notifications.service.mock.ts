import { Injectable, Provider } from '@angular/core';
import { of } from 'rxjs';
import { NotificationsService } from './notifications.service';

/** Defines the mock for the Background Job Service. */
@Injectable()
export class MockNotificationsService {
  public waitUntil$ = of();
}

/** Creates an injectable mock for Notifications Service. */
export function createMockNotificationsService(): Provider {
  return { provide: NotificationsService, useValue: new MockNotificationsService() };
}
