import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { WoodstockLeaderboardTalentService } from './woodstock-leaderboard-talent.service';

/** Defines the mock for the API Service. */
export class MockWoodstockLeaderboardTalentService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getLeaderboardTalentIdentities$ = jasmine
    .createSpy('getLeaderboardTalentIdentities$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Woodstock Service. */
export function createWoodstockLeaderboardTalentService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: WoodstockLeaderboardTalentService,
    useValue: new MockWoodstockLeaderboardTalentService(returnValueGenerator),
  };
}
