import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { WoodstockAuctionsService } from './woodstock-auctions.service';

/** Defines the mock for the API Service. */
export class MockWoodstockAuctionsService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public createSingleAuction$ = jasmine
    .createSpy('createSingleAuction$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(null))));

  public createBulkAuction$ = jasmine
    .createSpy('createBulkAuction$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(null))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Woodstock Service. */
export function createMockWoodstockAuctionsService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: WoodstockAuctionsService,
    useValue: new MockWoodstockAuctionsService(returnValueGenerator),
  };
}
