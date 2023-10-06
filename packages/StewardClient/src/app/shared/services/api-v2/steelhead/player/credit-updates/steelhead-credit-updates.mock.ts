import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadPlayerCreditUpdatesService } from './steelhead-credit-updates.service';

/** Defines the mock for the API Service. */
export class MockSteelheadPlayerCreditUpdatesService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getCreditHistoryByXuid$ = jasmine
    .createSpy('getCreditHistoryByXuid$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Steelhead Service. */
export function createMockSteelheadPlayerCreditUpdatesService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadPlayerCreditUpdatesService,
    useValue: new MockSteelheadPlayerCreditUpdatesService(returnValueGenerator),
  };
}
