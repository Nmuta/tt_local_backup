import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SunrisePlayerCreditUpdatesService } from './sunrise-credit-updates.service';

/** Defines the mock for the API Service. */
export class MockSunrisePlayerCreditUpdatesService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getCreditHistoryByXuid$ = jasmine
    .createSpy('getCreditHistoryByXuid$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Sunrise Service. */
export function createMockSunrisePlayerCreditUpdatesService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SunrisePlayerCreditUpdatesService,
    useValue: new MockSunrisePlayerCreditUpdatesService(returnValueGenerator),
  };
}
