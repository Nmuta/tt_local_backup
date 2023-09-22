import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { WoodstockUgcVisibilityStatusService } from './woodstock-ugc-visibility-status.service';

/** Defines the mock for the API Service. */
export class MockWoodstockUgcVisibilityStatusService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public publicUgcItems$ = jasmine
    .createSpy('publicUgcItems$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  public privateUgcItems$ = jasmine
    .createSpy('privateUgcItems$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Woodstock Ugc Visibility Service. */
export function createMockWoodstockUgcVisibilityStatusService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: WoodstockUgcVisibilityStatusService,
    useValue: new MockWoodstockUgcVisibilityStatusService(returnValueGenerator),
  };
}
