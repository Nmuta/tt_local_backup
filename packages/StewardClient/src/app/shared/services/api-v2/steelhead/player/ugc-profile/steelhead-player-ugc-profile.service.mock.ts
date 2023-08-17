import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadPlayerUgcProfileService } from './steelhead-player-ugc-profile.service';

/** Defines the mock for the API Service. */
export class MockSteelheadPlayerUgcProfileService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getUgcProfile$ = jasmine
    .createSpy('getUgcProfile$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of())));

  public updateUgcProfile$ = jasmine
    .createSpy('updateUgcProfile$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of())));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Steelhead Player UGC Profile service. */
export function createMockSteelheadPlayerUgcProfileService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadPlayerUgcProfileService,
    useValue: new MockSteelheadPlayerUgcProfileService(returnValueGenerator),
  };
}
