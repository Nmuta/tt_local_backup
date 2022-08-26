import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadUgcLookupService } from './steelhead-ugc-lookup.service';

/** Defines the mock for the Steelhead UGC lookup API Service. */
export class MockSteelheadUgcLookupService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getPlayerUgcItem$ = jasmine
    .createSpy('getPlayerUgcItem$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(null))));

  public getUgcBySharecode$ = jasmine
    .createSpy('getUgcBySharecode$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  public getUgcPhotoThumbnails$ = jasmine
    .createSpy('getUgcPhotoThumbnails$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Steelhead UGC lookup service. */
export function createMockSteelheadUgcLookupService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadUgcLookupService,
    useValue: new MockSteelheadUgcLookupService(returnValueGenerator),
  };
}
