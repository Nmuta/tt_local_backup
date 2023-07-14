import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadConsolesService } from './steelhead-consoles.service';

/** Defines the mock for the API Service. */
export class MockSteelheadConsolesService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public putBanStatusByConsoleId$ = jasmine
    .createSpy('putBanStatusByConsoleId$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Woodstock Service. */
export function createMockSteelheadConsolesService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadConsolesService,
    useValue: new MockSteelheadConsolesService(returnValueGenerator),
  };
}
