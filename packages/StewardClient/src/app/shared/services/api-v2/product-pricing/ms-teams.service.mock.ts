import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { ProductPricingService } from './product-pricing.service';

/** Defines the mock for the Product Pricing Service. */
export class MockProductPricingService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getProductIds$ = jasmine
    .createSpy('getProductIds$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(null))));

  public getPricingByProductId$ = jasmine
    .createSpy('getPricingByProductId$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(null))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Users Service. */
export function createMockProductPricingService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: ProductPricingService,
    useValue: new MockProductPricingService(returnValueGenerator),
  };
}
