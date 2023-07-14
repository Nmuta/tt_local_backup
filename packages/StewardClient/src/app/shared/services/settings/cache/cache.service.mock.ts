import { Injectable, Provider } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { CacheService } from './cache.service';

/** Defines the mock for the Cache API Service. */
@Injectable()
export class MockCacheService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getLspEndpoints$ = jasmine
    .createSpy('getLspEndpoints')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of())));
}
/** Creates an injectable mock for Cache Service. */
export function createMockCacheService(): Provider {
  return {
    provide: CacheService,
    useValue: new MockCacheService(),
  };
}
