import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadPlayerCmsOverrideService } from './steelhead-player-cms-override.service';

/** Defines the mock for the API Service. */
export class MockSteelheadPlayerCmsOverrideService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getCmsOverrideByXuid$ = jasmine
    .createSpy('getCmsOverrideByXuid$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of())));

  public setCmsOverrideByXuid$ = jasmine
    .createSpy('setCmsOverrideByXuid$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of())));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Steelhead Cms Override Service. */
export function createMockSteelheadPlayerCmsOverrideService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadPlayerCmsOverrideService,
    useValue: new MockSteelheadPlayerCmsOverrideService(returnValueGenerator),
  };
}
