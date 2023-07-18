import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { MultipleBanHistoryService } from './ban-history.service';

/** Defines the mock for the API Service. */
export class MockMultipleBanHistoryService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getBanHistoriesByXuid$ = jasmine
    .createSpy('getBanHistoriesByXuid$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of())));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Multiple Ban History Service. */
export function createMockMultipleBanHistoryService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: MultipleBanHistoryService,
    useValue: new MockMultipleBanHistoryService(returnValueGenerator),
  };
}
