import { GameTitle } from '@models/enums';
import { CommunityMessage } from '@models/community-message';
import { Observable } from 'rxjs';
import BigNumber from 'bignumber.js';
import { GroupNotification } from '@models/notifications.model';

/** Group notification management contract. */
export interface GroupNotificationManagementContract {
  /** Get game title. */
  gameTitle: GameTitle;

  /** Get group notifications. */
  getGroupNotifications$(lspGroupId: BigNumber): Observable<GroupNotification[]>;

  /** Update group notification. */
  postEditLspGroupCommunityMessage$(
    lspGroupId: BigNumber,
    notificationId: string,
    communityMessage: CommunityMessage,
  ): Observable<void>;

  /** Delete group notification. */
  deleteLspGroupCommunityMessage$(lspGroupId: BigNumber, notificationId: string): Observable<void>;
}
