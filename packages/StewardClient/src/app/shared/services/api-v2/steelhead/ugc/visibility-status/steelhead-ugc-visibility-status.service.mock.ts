import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadUgcVisibilityStatusService } from './steelhead-ugc-visibility-status.service';

/** Defines the mock for the API Service. */
export class MockSteelheadUgcVisibilityStatusService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public publicUgcItems$ = jasmine
    .createSpy('publicUgcItems$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  public privateUgcItems$ = jasmine
    .createSpy('privateUgcItems$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Steelhead Ugc Visibility Service. */
export function createMockSteelheadUgcVisibilityStatusService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadUgcVisibilityStatusService,
    useValue: new MockSteelheadUgcVisibilityStatusService(returnValueGenerator),
  };
}
