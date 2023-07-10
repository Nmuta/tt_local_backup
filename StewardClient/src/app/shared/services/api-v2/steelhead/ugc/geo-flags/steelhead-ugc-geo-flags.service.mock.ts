import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadUgcGeoFlagsService } from './steelhead-ugc-geo-flags.service';

/** Defines the mock for the API Service. */
export class MockSteelheadUgcGeoFlagsService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public setUgcGeoFlag$ = jasmine
    .createSpy('setUgcGeoFlag$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Steelhead Ugc Report Service. */
export function createMockSteelheadUgcGeoFlagsService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadUgcGeoFlagsService,
    useValue: new MockSteelheadUgcGeoFlagsService(returnValueGenerator),
  };
}
