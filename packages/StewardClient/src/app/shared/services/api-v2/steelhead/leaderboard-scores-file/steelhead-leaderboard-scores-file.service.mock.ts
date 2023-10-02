import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadLeaderboardScoresFileService } from './steelhead-leaderboard-scores-file.service';

/** Defines the mock for the API Service. */
export class MockSteelheadLeaderboardScoresFileService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public generateLeaderboardScoresFile$ = jasmine
    .createSpy('generateLeaderboardScoresFile$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  public retrieveLeaderboardScoresFile$ = jasmine
    .createSpy('retrieveLeaderboardScoresFile$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  public getLeaderboardScoresFileMetadata$ = jasmine
    .createSpy('getLeaderboardScoresFileMetadata$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Steelhead Service. */
export function createMockSteelheadLeaderboardScoresFileService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadLeaderboardScoresFileService,
    useValue: new MockSteelheadLeaderboardScoresFileService(returnValueGenerator),
  };
}
