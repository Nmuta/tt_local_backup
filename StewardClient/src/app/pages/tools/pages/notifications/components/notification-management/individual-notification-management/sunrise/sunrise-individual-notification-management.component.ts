import { Component, Input, ViewChild } from '@angular/core';
import { MAT_DATE_RANGE_SELECTION_STRATEGY } from '@angular/material/datepicker';
import { ForceStartDateToUtcNowSelectionStrategy } from '@components/date-time-pickers/datetime-range-picker/date-range-selection-strategies';
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
  providers: [
    SunriseIndividualNotificationManagementContract,
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: ForceStartDateToUtcNowSelectionStrategy,
    },
  ],
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
