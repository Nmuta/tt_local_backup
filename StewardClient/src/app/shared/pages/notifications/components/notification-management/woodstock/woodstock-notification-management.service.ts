import { Injectable } from '@angular/core';
import { GameTitle } from '@models/enums';
import { NotificationManagementService } from '../notification-management.service';
import { Observable } from 'rxjs';
import BigNumber from 'bignumber.js';
import { CommunityMessage } from '@models/community-message';
import { WoodstockService } from '@services/woodstock';
import { GroupNotifications } from '@models/notifications.model';

/**
 *  Sunrise notification management service.
 */
@Injectable()
export class WoodstockNotificationManagementService implements NotificationManagementService {
  constructor(private readonly woodstockService: WoodstockService) {}

  /** Gets the game title. */
  public getGameTitle(): GameTitle {
    return GameTitle.FH5;
  }

  /** Get group notifications. */
  public getGroupNotifications$(lspGroupId: BigNumber): Observable<GroupNotifications> {
    return this.woodstockService.getGroupNotifications$(lspGroupId);
  }

  /** Edit LSP group notification. */
  public postEditLspGroupCommunityMessage$(
    notificationId: string,
    communityMessage: CommunityMessage,
  ): Observable<void> {
    return this.woodstockService.postEditLspGroupCommunityMessage$(
      notificationId,
      communityMessage,
    );
  }

  /** Delete LSP group notification. */
  public deleteLspGroupCommunityMessage$(notificationId: string): Observable<void> {
    return this.woodstockService.deleteLspGroupCommunityMessage$(notificationId);
  }
}
