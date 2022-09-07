import { Component, Input, ViewChild } from '@angular/core';
import { MAT_DATE_RANGE_SELECTION_STRATEGY } from '@angular/material/datepicker';
import { ForceStartDateToUtcNowSelectionStrategy } from '@components/date-time-pickers/datetime-range-picker/date-range-selection-strategies';
import { LspGroup } from '@models/lsp-group';
import { GroupNotificationManagementComponent } from '../group-notification-management.component';
import { SunriseGroupNotificationManagementContract } from './sunrise-group-notification-management.contract';

/**
 *  Sunrise group notification management component.
 */
@Component({
  selector: 'sunrise-group-notification-management',
  templateUrl: './sunrise-group-notification-management.component.html',
  styleUrls: [],
  providers: [
    GroupNotificationManagementComponent,
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: ForceStartDateToUtcNowSelectionStrategy,
    },
  ],
})
export class SunriseGroupNotificationManagementComponent {
  /** The selected LSP group. */
  @Input() public selectedLspGroup: LspGroup;
  @ViewChild(GroupNotificationManagementComponent)
  private managementComponent: GroupNotificationManagementComponent;
  constructor(public service: SunriseGroupNotificationManagementContract) {}

  /** Refresh notification list.  */
  public refreshNotificationList(): void {
    this.managementComponent.refreshNotificationList();
  }
}
