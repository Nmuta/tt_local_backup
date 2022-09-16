import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadPlayerConsolesService } from './steelhead-player-consoles.service';

/** Defines the mock for the API Service. */
export class MockSteelheadPlayerConsolesService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getConsoleDetailsByXuid$ = jasmine
    .createSpy('getConsoleDetailsByXuid$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  public getSharedConsoleUsersByXuid$ = jasmine
    .createSpy('getSharedConsoleUsersByXuid$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Woodstock Service. */
export function createMockSteelheadPlayerConsolesService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadPlayerConsolesService,
    useValue: new MockSteelheadPlayerConsolesService(returnValueGenerator),
  };
}
