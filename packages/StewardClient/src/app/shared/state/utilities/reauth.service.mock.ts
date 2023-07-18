import { Injectable, Provider } from '@angular/core';
import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { ReauthService } from './reauth.service';

/** Defines the mock for the Logger Service. */
@Injectable()
export class MockReauthService {
  /** Generates a passthru pipe. */
  public reauthOnFailure<T>(
    _url: string,
    _restartWith$: () => Observable<T>,
  ): MonoTypeOperatorFunction<T> {
    return function (source$: Observable<T>): Observable<T> {
      return source$;
    };
  }
}

/** Creates an injectable mock for Logger Service. */
export function createMockReauthService(): Provider {
  return { provide: ReauthService, useValue: new MockReauthService() };
}
