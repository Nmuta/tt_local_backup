import { Component } from '@angular/core';
import { SunriseNotificationManagementService } from './sunrise-notification-management.service';

/**
 *  Sunrise service management component.
 */
@Component({
  templateUrl: './sunrise-notification-management.component.html',
  styleUrls: [],
  providers: [SunriseNotificationManagementService],
})
export class SunriseNotificationManagementComponent {
  constructor(public service: SunriseNotificationManagementService) {}
}
