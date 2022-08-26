import { Component, Input, ViewChild } from '@angular/core';
import { LspGroup } from '@models/lsp-group';
import { GroupNotificationManagementComponent } from '../group-notification-management.component';
import { SteelheadGroupNotificationManagementContract } from './steelhead-group-notification-management.contract';

/**
 *  Steelhead group notification management component.
 */
@Component({
  selector: 'steelhead-group-notification-management',
  templateUrl: './steelhead-group-notification-management.component.html',
  styleUrls: [],
})
export class SteelheadGroupNotificationManagementComponent {
  /** The selected LSP group. */
  @Input() public selectedLspGroup: LspGroup;
  @ViewChild(GroupNotificationManagementComponent)
  private managementComponent: GroupNotificationManagementComponent;
  constructor(public service: SteelheadGroupNotificationManagementContract) {}

  /** Refresh notification list.  */
  public refreshNotificationList(): void {
    this.managementComponent.refreshNotificationList();
  }
}
