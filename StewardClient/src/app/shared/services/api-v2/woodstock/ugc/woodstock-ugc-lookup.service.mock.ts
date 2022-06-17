import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { WoodstockUgcLookupService } from './woodstock-ugc-lookup.service';

/** Defines the mock for the API Service. */
export class MockWoodstockUgcLookupService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public GetPhotoThumbnails$ = jasmine
    .createSpy('GetPhotoThumbnails$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Woodstock Service. */
export function createMockWoodstockUgcLookupService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: WoodstockUgcLookupService,
    useValue: new MockWoodstockUgcLookupService(returnValueGenerator),
  };
}
