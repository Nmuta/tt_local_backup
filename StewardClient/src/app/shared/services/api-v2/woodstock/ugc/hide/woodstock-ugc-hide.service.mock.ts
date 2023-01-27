import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { WoodstockUgcHideService } from './woodstock-ugc-hide.service';

/** Defines the mock for the API Service. */
export class MockWoodstockUgcHideService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public hideMultipleUgc$ = jasmine
    .createSpy('hideMultipleUgc$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Woodstock Ugc Hide Service. */
export function createMockWoodstockUgcHideService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: WoodstockUgcHideService,
    useValue: new MockWoodstockUgcHideService(returnValueGenerator),
  };
}
