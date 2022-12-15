import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadLeaderboardsService } from './steelhead-leaderboards.service';

/** Defines the mock for the API Service. */
export class MockSteelheadLeaderboardsService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public deleteLeaderboardScores$ = jasmine
    .createSpy('deleteLeaderboardScores$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Steelhead Service. */
export function createMockSteelheadLeaderboardsService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadLeaderboardsService,
    useValue: new MockSteelheadLeaderboardsService(returnValueGenerator),
  };
}
