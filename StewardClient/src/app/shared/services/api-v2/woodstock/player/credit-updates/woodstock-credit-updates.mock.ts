import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { WoodstockPlayerCreditUpdatesService } from './woodstock-credit-updates.service';

/** Defines the mock for the API Service. */
export class MockWoodstockPlayerCreditUpdatesService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getCreditHistoryByXuid$ = jasmine
    .createSpy('getCreditHistoryByXuid$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Woodstock Service. */
export function createWoodstockPlayerCreditUpdatesService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: WoodstockPlayerCreditUpdatesService,
    useValue: new MockWoodstockPlayerCreditUpdatesService(returnValueGenerator),
  };
}
