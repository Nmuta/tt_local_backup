import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { WoodstockUgcHideStatusService } from './woodstock-ugc-hide-status.service';

/** Defines the mock for the API Service. */
export class MockWoodstockUgcHideStatusService {
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
export function createMockWoodstockUgcHideStatusService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: WoodstockUgcHideStatusService,
    useValue: new MockWoodstockUgcHideStatusService(returnValueGenerator),
  };
}
