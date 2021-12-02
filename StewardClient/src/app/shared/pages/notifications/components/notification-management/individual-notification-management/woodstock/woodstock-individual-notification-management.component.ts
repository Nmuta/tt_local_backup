import { Component, Input, ViewChild } from '@angular/core';
import BigNumber from 'bignumber.js';
import { IndividualNotificationManagementComponent } from '../individual-notification-management.component';
import { WoodstockIndividualNotificationManagementContract } from './woodstock-individual-notification-management.contract';

/**
 *  Woodstock individual notification management component.
 */
@Component({
  selector: 'woodstock-individual-notification-management',
  templateUrl: './woodstock-individual-notification-management.component.html',
  styleUrls: [],
  providers: [WoodstockIndividualNotificationManagementContract],
})
export class WoodstockIndividualNotificationManagementComponent {
  /** The selected xuid. */
  @Input() public selectedXuid: BigNumber;
  @ViewChild(IndividualNotificationManagementComponent)
  private managementComponent: IndividualNotificationManagementComponent;
  constructor(public service: WoodstockIndividualNotificationManagementContract) {}

  /** Refresh notification list.  */
  public refreshNotificationList(): void {
    this.managementComponent.refreshNotificationList();
  }
}
