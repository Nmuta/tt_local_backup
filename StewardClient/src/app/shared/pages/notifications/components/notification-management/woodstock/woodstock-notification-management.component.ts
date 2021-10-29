import { Component, Input, ViewChild } from '@angular/core';
import { LspGroup } from '@models/lsp-group';
import { NotificationManagementComponent } from '../notification-management.component';
import { WoodstockNotificationManagementService } from './woodstock-notification-management.service';

/**
 *  Woodstock service management component.
 */
@Component({
  selector: 'woodstock-notification-management',
  templateUrl: './woodstock-notification-management.component.html',
  styleUrls: [],
  providers: [WoodstockNotificationManagementService],
})
export class WoodstockNotificationManagementComponent {
  @Input() public selectedLspGroup: LspGroup;
  /** True for player lookup, false for LSP group lookup.  */
  @Input() public isUsingPlayerIdentities: boolean;
  @ViewChild(NotificationManagementComponent)
  private managementComponent: NotificationManagementComponent;
  constructor(public service: WoodstockNotificationManagementService) {}

  /** Refresh notification list.  */
  public refreshNotificationList(): void {
    this.managementComponent.refreshNotificationList();
  }
}
