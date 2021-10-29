import { Component, Input, ViewChild } from '@angular/core';
import { LspGroup } from '@models/lsp-group';
import { NotificationManagementComponent } from '../notification-management.component';
import { SunriseNotificationManagementService } from './sunrise-notification-management.service';

/**
 *  Sunrise service management component.
 */
@Component({
  selector: 'sunrise-notification-management',
  templateUrl: './sunrise-notification-management.component.html',
  styleUrls: [],
  providers: [SunriseNotificationManagementService],
})
export class SunriseNotificationManagementComponent {
  @Input() public selectedLspGroup: LspGroup;
  /** True for player lookup, false for LSP group lookup.  */
  @Input() public isUsingPlayerIdentities: boolean;
  @ViewChild(NotificationManagementComponent)
  private managementComponent: NotificationManagementComponent;
  constructor(public service: SunriseNotificationManagementService) {}

  /** Refresh notification list.  */
  public refreshNotificationList(): void {
    this.managementComponent.refreshNotificationList();
  }
}
