import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { WoodstockLeaderboardsService } from './woodstock-leaderboards.service';

/** Defines the mock for the API Service. */
export class MockWoodstockLeaderboardsService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getLeaderboards$ = jasmine
    .createSpy('getLeaderboards$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Woodstock Service. */
export function createMockWoodstockLeaderboardsService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: WoodstockLeaderboardsService,
    useValue: new MockWoodstockLeaderboardsService(returnValueGenerator),
  };
}
