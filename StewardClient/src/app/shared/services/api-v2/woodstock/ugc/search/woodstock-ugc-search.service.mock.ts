import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { WoodstockUgcSearchService } from './woodstock-ugc-search.service';

/** Defines the mock for the API Service. */
export class MockWoodstockUgcSearchService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public GetPhotoThumbnails$ = jasmine
    .createSpy('GetPhotoThumbnails$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Woodstock Service. */
export function createMockWoodstockUgcSearchService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: WoodstockUgcSearchService,
    useValue: new MockWoodstockUgcSearchService(returnValueGenerator),
  };
}
