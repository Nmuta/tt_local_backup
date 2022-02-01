import { Component, Input, ViewChild } from '@angular/core';
import BigNumber from 'bignumber.js';
import { IndividualNotificationManagementComponent } from '../individual-notification-management.component';
import { SunriseIndividualNotificationManagementContract } from './sunrise-individual-notification-management.contract';

/**
 *  Sunrise individual notification management component.
 */
@Component({
  selector: 'sunrise-individual-notification-management',
  templateUrl: './sunrise-individual-notification-management.component.html',
  styleUrls: [],
  providers: [SunriseIndividualNotificationManagementContract],
})
export class SunriseIndividualNotificationManagementComponent {
  /** The selected xuid. */
  @Input() public selectedXuid: BigNumber;
  @ViewChild(IndividualNotificationManagementComponent)
  private managementComponent: IndividualNotificationManagementComponent;
  constructor(public service: SunriseIndividualNotificationManagementContract) {}

  /** Refresh notification list.  */
  public refreshNotificationList(): void {
    this.managementComponent.refreshNotificationList();
  }
}
