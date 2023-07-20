import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadUgcFeaturedStatusService } from './steelhead-ugc-featured-status.service';

/** Defines the mock for the API Service. */
export class MockSteelheadUgcFeaturedStatusService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public reportUgc$ = jasmine
    .createSpy('setUgcFeaturedStatus$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Steelhead Ugc Featured Status Service. */
export function createMockSteelheadUgcFeaturedStatusService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadUgcFeaturedStatusService,
    useValue: new MockSteelheadUgcFeaturedStatusService(returnValueGenerator),
  };
}
