import { Component, Input, ViewChild } from '@angular/core';
import BigNumber from 'bignumber.js';
import { IndividualNotificationManagementComponent } from '../individual-notification-management.component';
import { SteelheadIndividualNotificationManagementContract } from './steelhead-individual-notification-management.contract';

/**
 *  Steelhead individual notification management component.
 */
@Component({
  selector: 'steelhead-individual-notification-management',
  templateUrl: './steelhead-individual-notification-management.component.html',
  styleUrls: [],
  providers: [SteelheadIndividualNotificationManagementContract],
})
export class SteelheadIndividualNotificationManagementComponent {
  /** The selected xuid. */
  @Input() public selectedXuid: BigNumber;
  @ViewChild(IndividualNotificationManagementComponent)
  private managementComponent: IndividualNotificationManagementComponent;
  constructor(public service: SteelheadIndividualNotificationManagementContract) {}

  /** Refresh notification list.  */
  public refreshNotificationList(): void {
    this.managementComponent.refreshNotificationList();
  }
}
