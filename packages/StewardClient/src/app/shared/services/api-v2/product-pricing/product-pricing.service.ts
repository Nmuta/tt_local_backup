import { Injectable } from '@angular/core';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** Price information as sourced from Big Catalog. */
export interface BigCatProductPrice {
  currencyCode: string;
  wholesaleCurrencyCode: string;
  listPrice: BigNumber;
  wholesalePrice: BigNumber;
  msrp: BigNumber;
  isPiRequired: boolean;
}

/** Product information as sourced from Big Catalog. */
export interface BigCatProductInfo {
  name: string;
  prices: BigCatProductPrice[];
}

/** The /v2/pricing endpoints. */
@Injectable({
  providedIn: 'root',
})
export class ProductPricingService {
  public readonly basePath: string = 'pricing';

  constructor(private readonly api: ApiV2Service) {}

  /** Retrieves a curated list of products and IDs from Steward. */
  public getProductIds$(): Observable<Map<string, string>> {
    return this.api.getRequest$<Map<string, string>>(`${this.basePath}/productIds`);
  }

  /** Sends feature request to Steward's MS Teams help channel. */
  public getPricingByProductId$(productId: string): Observable<BigCatProductInfo> {
    return this.api.getRequest$<BigCatProductInfo>(`${this.basePath}/${productId}`);
  }
}
