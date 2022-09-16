import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadBanHistoryService } from './steelhead-ban-history.service';

/** Defines the mock for the API Service. */
export class MockSteelheadBanHistoryService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getBanHistoryByXuid$ = jasmine
    .createSpy('getBanHistoryByXuid$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Woodstock Service. */
export function createMockSteelheadBanHistoryService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadBanHistoryService,
    useValue: new MockSteelheadBanHistoryService(returnValueGenerator),
  };
}
