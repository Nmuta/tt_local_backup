import { Injectable } from '@angular/core';
import { GameTitle } from '@models/enums';
import { SunriseService } from '@services/sunrise';
import { NotificationManagementService } from '../notification-management.service';
import { Observable } from 'rxjs';
import BigNumber from 'bignumber.js';
import { CommunityMessage } from '@models/community-message';
import { GroupNotifications } from '@models/notifications.model';

/**
 *  Sunrise notification management service.
 */
@Injectable()
export class SunriseNotificationManagementService implements NotificationManagementService {
  constructor(private readonly sunriseService: SunriseService) {}

  /** Gets the game title. */
  public getGameTitle(): GameTitle {
    return GameTitle.FH4;
  }

  /** Get group notifications. */
  public getGroupNotifications$(lspGroupId: BigNumber): Observable<GroupNotifications> {
    return this.sunriseService.getGroupNotifications$(lspGroupId);
  }

  /** Edit LSP group notification. */
  public postEditLspGroupCommunityMessage$(
    notificationId: string,
    communityMessage: CommunityMessage,
  ): Observable<void> {
    return this.sunriseService.postEditLspGroupCommunityMessage$(notificationId, communityMessage);
  }

  /** Delete LSP group notification. */
  public deleteLspGroupCommunityMessage$(notificationId: string): Observable<void> {
    return this.sunriseService.deleteLspGroupCommunityMessage$(notificationId);
  }
}
