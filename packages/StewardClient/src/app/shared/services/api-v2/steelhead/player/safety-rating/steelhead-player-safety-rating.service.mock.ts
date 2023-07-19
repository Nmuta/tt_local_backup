import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadPlayerSafetyRatingService } from './steelhead-player-safety-rating.service';

/** Defines the mock for the API Service. */
export class MockSteelheadPlayerSafetyRatingService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getSafetyRatingByXuid$ = jasmine
    .createSpy('getSafetyRatingByXuid$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of())));

  public deleteSafetyRatingByXuid$ = jasmine
    .createSpy('deleteSafetyRatingByXuid$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of())));

  public setSafetyRatingByXuid$ = jasmine
    .createSpy('setSafetyRatingByXuid$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of())));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Steelhead Safety Rating Service. */
export function createMockSteelheadPlayerSafetyRatingService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadPlayerSafetyRatingService,
    useValue: new MockSteelheadPlayerSafetyRatingService(returnValueGenerator),
  };
}
