import { Component, Input, ViewChild } from '@angular/core';
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
  providers: [GroupNotificationManagementComponent],
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
