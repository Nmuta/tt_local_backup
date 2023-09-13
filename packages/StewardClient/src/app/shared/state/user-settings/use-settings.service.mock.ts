import { Injectable, Provider } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserSettingsService } from './user-settings.service';

/** Defines the mock for the User Settings Service. */
@Injectable()
export class MockUserSettingsService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  /** Mocking property. */
  public get lastSeenAppVersion(): string {
    return 'fake-app-version-1';
  }

  /** Mocking property. */
  public set lastSeenAppVersion(value: string) {
    return;
  }

  /** Mocking property. */
  public get currentAppVersion(): string {
    return 'fake-app-version-2';
  }

  /** Mocking property. */
  public set currentAppVersion(value: string) {
    return;
  }
}

/** Creates an injectable mock for User Settings Service. */
export function createMockUserSettingsService(): Provider {
  return {
    provide: UserSettingsService,
    useValue: new MockUserSettingsService(),
  };
}
