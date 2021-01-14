import { Component, Input, OnChanges } from '@angular/core';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { SunrisePlayerNotifications } from '@models/sunrise';
import { SunriseService } from '@services/sunrise';
import { sortBy } from 'lodash';

/** Retreives and displays a players' Sunrise notifications by XUID. */
@Component({
  selector: 'sunrise-player-notifications',
  templateUrl: './sunrise-player-notifications.component.html',
  styleUrls: ['./sunrise-player-notifications.component.scss'],
})
export class SunrisePlayerNotificationsComponent implements OnChanges {
  @Input() public xuid?: BigInt;

  /** True while waiting on a request. */
  public isLoading = true;
  /** The error received while loading. */
  public loadError: unknown;

  public seenIcon = faEye;
  public unSeenIcon = faEyeSlash;

  public notifications: SunrisePlayerNotifications = undefined;
  public columnsToDisplay = [
    'notificationType',
    'isRead',
    'notificationId',
    'sendDateUtc',
    'expirationDateUtc',
  ];

  constructor(private readonly sunrise: SunriseService) {}

  /** Initialization hook. */
  public ngOnChanges(): void {
    if (!this.xuid) {
      return;
    }

    this.isLoading = true;
    this.loadError = undefined;
    this.sunrise.getPlayerNotificationsByXuid(this.xuid).subscribe(
      notifications => {
        this.isLoading = false;
        this.notifications = sortBy(notifications, n => n.sendDateUtc).reverse();
      },
      _error => {
        this.isLoading = false;
        this.loadError = _error; // TODO: Display something useful to the user
      },
    );
  }
}
