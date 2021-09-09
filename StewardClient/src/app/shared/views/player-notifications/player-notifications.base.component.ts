import BigNumber from 'bignumber.js';
import { Component, Input, OnChanges } from '@angular/core';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { SunrisePlayerNotification } from '@models/sunrise';
import { sortBy } from 'lodash';
import { EMPTY, Observable } from 'rxjs';
import { GameTitleCodeName } from '@models/enums';
import { catchError, take, takeUntil } from 'rxjs/operators';
import { BaseComponent } from '@components/base-component/base.component';
import { WoodstockPlayerNotification } from '@models/woodstock';
import { IdentityResultUnion } from '@models/identity-query.model';

export type NotificationUnion = SunrisePlayerNotification | WoodstockPlayerNotification;

/** Retreives and displays a player notifications by XUID. */
@Component({
  template: '',
})
export abstract class PlayerNotificationsBaseComponent<T extends NotificationUnion>
  extends BaseComponent
  implements OnChanges {
  @Input() public identity?: IdentityResultUnion;

  /** True while waiting on a request. */
  public isLoading = true;
  /** The error received while loading. */
  public loadError: unknown;

  public seenIcon = faEye;
  public unSeenIcon = faEyeSlash;

  public notifications: T[] = [];
  public columnsToDisplay = [
    'isRead',
    'notificationType',
    'notificationId',
    'sendDateUtc',
    'expirationDateUtc',
  ];

  public abstract gameTitle: GameTitleCodeName;
  public abstract getPlayerNotificationsByXuid$(xuid: BigNumber): Observable<T[]>;

  /** Initialization hook. */
  public ngOnChanges(): void {
    if (!this.identity || !this.identity?.xuid) {
      this.notifications = [];
      return;
    }

    this.isLoading = true;
    this.loadError = undefined;
    const getPlayerNotificationsByXuid$ = this.getPlayerNotificationsByXuid$(this.identity.xuid);
    getPlayerNotificationsByXuid$
      .pipe(
        take(1),
        catchError(error => {
          this.isLoading = false;
          this.loadError = error;
          return EMPTY;
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(notifications => {
        this.isLoading = false;
        this.notifications = sortBy(notifications, n => n.sendDateUtc).reverse();
      });
  }
}
