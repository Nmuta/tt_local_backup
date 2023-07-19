import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadPlayersService } from './steelhead-players.service';

/** Defines the mock for the API Service. */
export class MockSteelheadPlayersService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getBanSummariesByXuids$ = jasmine
    .createSpy('getBanSummariesByXuids$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  public postBanPlayers$ = jasmine
    .createSpy('postBanPlayers$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  public postBanPlayersWithBackgroundProcessing$ = jasmine
    .createSpy('postBanPlayersWithBackgroundProcessing$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Woodstock Service. */
export function createMockSteelheadPlayersService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadPlayersService,
    useValue: new MockSteelheadPlayersService(returnValueGenerator),
  };
}
