import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadPlayerGameDetailsService } from './steelhead-player-game-details.service';

/** Defines the mock for the API Service. */
export class MockSteelheadPlayerGameDetailsService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getUserGameDetails$ = jasmine
    .createSpy('getUserGameDetails$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of())));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Woodstock Service. */
export function createMockSteelheadPlayerGameDetailsService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadPlayerGameDetailsService,
    useValue: new MockSteelheadPlayerGameDetailsService(returnValueGenerator),
  };
}
