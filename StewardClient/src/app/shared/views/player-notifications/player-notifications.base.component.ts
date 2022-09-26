import BigNumber from 'bignumber.js';
import { Component, Input, OnChanges } from '@angular/core';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { cloneDeep, sortBy } from 'lodash';
import { EMPTY, Observable } from 'rxjs';
import { GameTitle } from '@models/enums';
import { catchError, take, takeUntil } from 'rxjs/operators';
import { BaseComponent } from '@components/base-component/base.component';
import { IdentityResultUnion } from '@models/identity-query.model';
import { PlayerNotification } from '@models/notifications.model';

type AnnotatedType<T> = T & { isCommunityMessage: boolean };

/** Retreives and displays a player notifications by XUID. */
@Component({
  template: '',
})
export abstract class PlayerNotificationsBaseComponent<T extends PlayerNotification>
  extends BaseComponent
  implements OnChanges
{
  /** REVIEW-COMMENT: Player identity. */
  @Input() public identity?: IdentityResultUnion;

  /** True while waiting on a request. */
  public isLoading = true;

  /** The error received while loading. */
  public loadError: unknown;

  public seenIcon = faEye;
  public unSeenIcon = faEyeSlash;

  public notifications: AnnotatedType<T>[] = [];
  public columnsToDisplay = [
    'isRead',
    'message',
    'notificationType',
    'notificationId',
    'sendDateUtc',
    'expirationDateUtc',
  ];

  public abstract gameTitle: GameTitle;
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
        const annotatedNotifications: AnnotatedType<T>[] = notifications.map(notification => {
          const x: AnnotatedType<T> = cloneDeep(notification) as unknown as AnnotatedType<T>;
          x.isCommunityMessage = this.isCommunityMessage(x);
          return x;
        });
        this.notifications = sortBy(annotatedNotifications, n => n.sentDateUtc).reverse();
        this.notifications.forEach(
          notification => (notification.isCommunityMessage = this.isCommunityMessage(notification)),
        );
      });
  }

  /** Checks if notification is of Community Message type */
  public isCommunityMessage(entry: PlayerNotification): boolean {
    return entry?.notificationType === 'CommunityMessageNotification';
  }
}
