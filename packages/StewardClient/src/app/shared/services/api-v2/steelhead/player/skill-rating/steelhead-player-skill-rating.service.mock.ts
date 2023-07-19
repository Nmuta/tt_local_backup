import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadPlayerSkillRatingService } from './steelhead-player-skill-rating.service';

/** Defines the mock for the API Service. */
export class MockSteelheadPlayerSkillRatingService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getSkillRating$ = jasmine
    .createSpy('getSkillRating$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of())));

  public overrideSkillRating$ = jasmine
    .createSpy('overrideSkillRating$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of())));

  public clearSkillRatingOverride$ = jasmine
    .createSpy('clearSkillRatingOverride$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of())));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Steelhead Skill Rating Service. */
export function createMockSteelheadSkillRatingService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadPlayerSkillRatingService,
    useValue: new MockSteelheadPlayerSkillRatingService(returnValueGenerator),
  };
}
