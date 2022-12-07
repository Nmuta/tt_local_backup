import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { WoodstockStorefrontService } from './woodstock-storefront.service';

/** Defines the mock for the Woodstock storefront API Service. */
export class MockWoodstockStorefrontService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getLayerGroup$ = jasmine
    .createSpy('getLayerGroup$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(null))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Woodstock Storefront Service. */
export function createMockWoodstockStorefrontService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: WoodstockStorefrontService,
    useValue: new MockWoodstockStorefrontService(returnValueGenerator),
  };
}
