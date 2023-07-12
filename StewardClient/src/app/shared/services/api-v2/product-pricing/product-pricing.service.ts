import { Injectable } from '@angular/core';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

export interface BigCatProductPrice {
  currencyCode: string;
  wholesaleCurrencyCode: string;
  listPrice: BigNumber;
  wholesalePrice: BigNumber;
  msrp: BigNumber;
  isPiRequired: boolean;
}

/** The /v2/pricing endpoints. */
@Injectable({
  providedIn: 'root',
})
export class ProductPricingService {
  public readonly basePath: string = 'pricing';

  constructor(private readonly api: ApiV2Service) {}

  /** Retrieves a curated list of products and IDs from Steward. */
  public getProductIds$(): Observable<Map<string, number>> {
    return this.api.getRequest$<Map<string, number>>(`${this.basePath}/productIds`);
  }

  /** Sends feature request to Steward's MS Teams help channel. */
  public getPricingByProductId$(productId: string): Observable<BigCatProductPrice> {
    return this.api.getRequest$<BigCatProductPrice>(`${this.basePath}/${productId}`);
  }
}
