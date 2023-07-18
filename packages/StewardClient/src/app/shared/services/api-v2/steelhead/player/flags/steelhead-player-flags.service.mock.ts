import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadPlayerFlagsService } from './steelhead-player-flags.service';

/** Defines the mock for the API Service. */
export class MockSteelheadPlayerFlagsService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getFlagsByXuid$ = jasmine
    .createSpy('getFlagsByXuid$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  public putFlagsByXuid$ = jasmine
    .createSpy('putFlagsByXuid$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Woodstock Service. */
export function createMockSteelheadPlayerFlagsService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadPlayerFlagsService,
    useValue: new MockSteelheadPlayerFlagsService(returnValueGenerator),
  };
}
