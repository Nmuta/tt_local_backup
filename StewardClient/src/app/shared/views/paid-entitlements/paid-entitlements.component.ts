import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { PaidEntitlement } from '@services/api-v2/steelhead/paid-entitlements/steelhead-paid-entitlements.service';
import { Observable, takeUntil } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GameTitle } from '@models/enums';
import BigNumber from 'bignumber.js';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';

export interface PaidEntitlementsServiceContract {
  /** Game title the service contract is associated with. */
  gameTitle: GameTitle;

  /** Gets a player's available paid entitlements. */
  getAvailablePaidEntitlements$(xuid: BigNumber): Observable<PaidEntitlement[]>;

  /** Grants a player a paid entitlement by product ID. */
  putPaidEntitlement$(xuid: BigNumber, productId: string): Observable<void>;
}

/**
 *  Loyalty Rewards component.
 */
@Component({
  selector: 'paid-entitlements',
  templateUrl: './paid-entitlements.component.html',
  styleUrls: ['./paid-entitlements.component.scss'],
})
export class PaidEntitlementsComponent extends BaseComponent implements OnInit {
  /** The paid entitlement service. */
  @Input() serviceContract: PaidEntitlementsServiceContract;
  /** Player identity. */
  @Input() identity: IdentityResultAlpha;

  public getMonitor = new ActionMonitor('GET Available Paid Entitlements');
  public putMonitor = new ActionMonitor('Put Send Entitlement');

  public availableEntitlements: PaidEntitlement[] = null;

  public readonly grantPaidEntitlementAttribute = PermAttributeName.GrantPaidEntitlements;

  public paidEntitlementFormControls = {
    entitlement: new FormControl('', Validators.required),
  };
  public paidEntitlementFormGroup = new FormGroup(this.paidEntitlementFormControls);

  constructor() {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    if (!this.serviceContract) {
      throw new Error('No service contract is defined for Paid Entitlements.');
    }

    this.serviceContract
      .getAvailablePaidEntitlements$(this.identity.xuid)
      .pipe(this.getMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(availableEntitlements => {
        this.availableEntitlements = availableEntitlements;
      });
  }

  /** Grant entitlement by productId. */
  public sendEntitlement(): void {
    this.putMonitor = this.putMonitor.repeat();
    const productId = this.paidEntitlementFormControls.entitlement.value;
    this.serviceContract
      .putPaidEntitlement$(this.identity.xuid, productId)
      .pipe(this.putMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(_ => {
        //TODO: When we have an API that returns what entitlements a user has, we will need to refresh that here
      });
  }
}
