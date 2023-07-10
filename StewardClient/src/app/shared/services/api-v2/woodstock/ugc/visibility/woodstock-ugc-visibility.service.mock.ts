import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { WoodstockUgcVisibilityService } from './woodstock-ugc-visibility.service';

/** Defines the mock for the API Service. */
export class MockWoodstockUgcVisibilityService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public hideUgcItems$ = jasmine
    .createSpy('hideUgcItems$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  public unhideUgcItems$ = jasmine
    .createSpy('unhideUgc$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Woodstock Ugc Hide Service. */
export function createMockWoodstockUgcVisibilityService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: WoodstockUgcVisibilityService,
    useValue: new MockWoodstockUgcVisibilityService(returnValueGenerator),
  };
}
