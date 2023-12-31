import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadUgcHideStatusService } from './steelhead-ugc-hide-status.service';

/** Defines the mock for the API Service. */
export class MockSteelheadUgcHideStatusService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public hideUgcItems$ = jasmine
    .createSpy('hideUgcItems$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  public hideUgcItemsUsingBackgroundJob$ = jasmine
    .createSpy('hideUgcItemsUsingBackgroundJob$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  public unhideUgcItems$ = jasmine
    .createSpy('hideUgcItems$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));
}

/** Creates an injectable mock for Steelhead Ugc Visibility Service. */
export function createMockSteelheadUgcHideStatusService(): ValueProvider {
  return {
    provide: SteelheadUgcHideStatusService,
    useValue: new MockSteelheadUgcHideStatusService(),
  };
}
