import { Component } from '@angular/core';
import { WoodstockNotificationManagementService } from './woodstock-notification-management.service';

/**
 *  Woodstock service management component.
 */
@Component({
  templateUrl: './woodstock-notification-management.component.html',
  styleUrls: [],
  providers: [WoodstockNotificationManagementService],
})
export class WoodstockNotificationManagementComponent {
  constructor(public service: WoodstockNotificationManagementService) {}
}
