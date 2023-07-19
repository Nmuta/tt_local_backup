import { Injectable } from '@angular/core';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** Interface that represents paid entitlements. */
export interface PaidEntitlement {
  description: string;
  productId: string;
}

/** The /v2/steelhead/player/{xuid}/paidEntitlements endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadPaidEntitlementsService {
  private basePath: string = 'title/steelhead/player';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets the paid entitlements available to a given user. */
  public getAvailablePaidEntitlements$(xuid: BigNumber): Observable<PaidEntitlement[]> {
    return this.api.getRequest$<PaidEntitlement[]>(`${this.basePath}/${xuid}/paidEntitlements`);
  }

  /** Gets the paid entitlements available to a given user. */
  public putPaidEntitlement$(xuid: BigNumber, productId: string): Observable<null> {
    return this.api.putRequest$(`${this.basePath}/${xuid}/paidEntitlements/${productId}`, null);
  }
}
