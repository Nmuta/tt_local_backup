import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SunriseUgcHideService } from './sunrise-ugc-hide.service';

/** Defines the mock for the API Service. */
export class MockSunriseUgcHideService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public hideMultipleUgc$ = jasmine
    .createSpy('hideMultipleUgc$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Sunrise Ugc Hide Service. */
export function createMockSunriseUgcHideService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SunriseUgcHideService,
    useValue: new MockSunriseUgcHideService(returnValueGenerator),
  };
}
