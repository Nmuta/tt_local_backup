import { GameTitle } from '@models/enums';
import { CommunityMessage } from '@models/community-message';
import { Observable } from 'rxjs';
import BigNumber from 'bignumber.js';
import { GroupNotification } from '@models/notifications.model';

/** Group notification management contract. */
export interface GroupNotificationManagementContract {
  /** Get game title. */
  getGameTitle(): GameTitle;

  /** Get group notifications. */
  getGroupNotifications$(lspGroupId: BigNumber): Observable<GroupNotification[]>;

  /** Update group notification. */
  postEditLspGroupCommunityMessage$(
    notificationId: string,
    communityMessage: CommunityMessage,
  ): Observable<void>;

  /** Delete group notification. */
  deleteLspGroupCommunityMessage$(notificationId: string): Observable<void>;
}
