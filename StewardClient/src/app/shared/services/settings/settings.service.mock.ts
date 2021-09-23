import { Injectable, Provider } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { SettingsService } from './settings.service';
import { SettingsGetEndpointsFakeApi } from '@interceptors/fake-api/apis/title/settings/lspEndpoints';

/** Defines the mock for the API Service. */
@Injectable()
export class MockSettingsService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getLspEndpoints$ = jasmine
    .createSpy('getLspEndpoints')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(SettingsGetEndpointsFakeApi.make()))),
    );
}
/** Creates an injectable mock for Settings Service. */
export function createMockSettingsService(): Provider {
  return {
    provide: SettingsService,
    useValue: new MockSettingsService(),
  };
}
