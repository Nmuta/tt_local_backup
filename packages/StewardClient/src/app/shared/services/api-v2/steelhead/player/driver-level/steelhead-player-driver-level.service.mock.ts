import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadPlayerDriverLevelService } from './steelhead-player-driver-level.service';

/** Defines the mock for the API Service. */
export class MockSteelheadPlayerDriverLevelService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getDriverLevel$ = jasmine
    .createSpy('getDriverLevel$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of())));

  public setDriverLevel$ = jasmine
    .createSpy('setDriverLevel$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of())));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Steelhead Cms Override Service. */
export function createMockSteelheadPlayerDriverLevelService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadPlayerDriverLevelService,
    useValue: new MockSteelheadPlayerDriverLevelService(returnValueGenerator),
  };
}
