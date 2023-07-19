import { Component, Input } from '@angular/core';
import { GameTitle } from '@models/enums';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SteelheadPaidEntitlementsService } from '@services/api-v2/steelhead/paid-entitlements/steelhead-paid-entitlements.service';
import { PaidEntitlementsServiceContract } from '../paid-entitlements.component';

/**
 *  Steelhead paid entitlements component.
 */
@Component({
  selector: 'steelhead-paid-entitlements',
  templateUrl: './steelhead-paid-entitlements.component.html',
})
export class SteelheadPaidEntitlementsComponent {
  /** Player identity. */
  @Input() identity: IdentityResultAlpha;

  public service: PaidEntitlementsServiceContract;

  constructor(paidEntitlementService: SteelheadPaidEntitlementsService) {
    this.service = {
      gameTitle: GameTitle.FM8,
      getAvailablePaidEntitlements$: xuid =>
        paidEntitlementService.getAvailablePaidEntitlements$(xuid),
      putPaidEntitlement$: (xuid, productId) =>
        paidEntitlementService.putPaidEntitlement$(xuid, productId),
    };
  }
}
