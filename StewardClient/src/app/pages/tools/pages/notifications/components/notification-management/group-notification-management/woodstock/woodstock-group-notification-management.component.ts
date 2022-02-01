import { Component, Input, ViewChild } from '@angular/core';
import { LspGroup } from '@models/lsp-group';
import { GroupNotificationManagementComponent } from '../group-notification-management.component';
import { WoodstockGroupNotificationManagementContract } from './woodstock-group-notification-management.contract';

/**
 *  Woodstock group notification management component.
 */
@Component({
  selector: 'woodstock-group-notification-management',
  templateUrl: './woodstock-group-notification-management.component.html',
  styleUrls: [],
  providers: [GroupNotificationManagementComponent],
})
export class WoodstockGroupNotificationManagementComponent {
  /** The selected LSP group. */
  @Input() public selectedLspGroup: LspGroup;
  @ViewChild(GroupNotificationManagementComponent)
  private managementComponent: GroupNotificationManagementComponent;
  constructor(public service: WoodstockGroupNotificationManagementContract) {}

  /** Refresh notification list.  */
  public refreshNotificationList(): void {
    this.managementComponent.refreshNotificationList();
  }
}
