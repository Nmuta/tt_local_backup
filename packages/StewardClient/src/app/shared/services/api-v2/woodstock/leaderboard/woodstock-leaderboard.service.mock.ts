import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { WoodstockLeaderboardService } from './woodstock-leaderboard.service';

/** Defines the mock for the API Service. */
export class MockWoodstockLeaderboardService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getLeaderboardScores$ = jasmine
    .createSpy('getLeaderboardScores$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  public getLeaderboardScoresNearPlayer$ = jasmine
    .createSpy('getLeaderboardScoresNearPlayer$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  public deleteLeaderboardScores$ = jasmine
    .createSpy('deleteLeaderboardScores$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Woodstock Service. */
export function createMockWoodstockLeaderboardsService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: WoodstockLeaderboardService,
    useValue: new MockWoodstockLeaderboardService(returnValueGenerator),
  };
}
