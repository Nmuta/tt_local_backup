import BigNumber from 'bignumber.js';
import { Component, Input, OnChanges } from '@angular/core';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { WoodstockPlayerNotifications } from '@models/woodstock';
import { WoodstockService } from '@services/woodstock';
import { sortBy } from 'lodash';

/** Retreives and displays a players' Woodstock notifications by XUID. */
@Component({
  selector: 'woodstock-player-notifications',
  templateUrl: './woodstock-player-notifications.component.html',
  styleUrls: ['./woodstock-player-notifications.component.scss'],
})
export class WoodstockPlayerNotificationsComponent implements OnChanges {
  @Input() public xuid?: BigNumber;

  /** True while waiting on a request. */
  public isLoading = true;
  /** The error received while loading. */
  public loadError: unknown;

  public seenIcon = faEye;
  public unSeenIcon = faEyeSlash;

  public notifications: WoodstockPlayerNotifications = undefined;
  public columnsToDisplay = [
    'isRead',
    'notificationType',
    'notificationId',
    'sendDateUtc',
    'expirationDateUtc',
  ];

  constructor(private readonly woodstock: WoodstockService) {}

  /** Initialization hook. */
  public ngOnChanges(): void {
    if (!this.xuid) {
      return;
    }

    this.isLoading = true;
    this.loadError = undefined;
    this.woodstock.getPlayerNotificationsByXuid(this.xuid).subscribe(
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
