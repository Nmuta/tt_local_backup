import { GameTitle } from '@models/enums';
import { CommunityMessage } from '@models/community-message';
import { Observable } from 'rxjs';
import BigNumber from 'bignumber.js';
import { GroupNotification } from '@models/notifications.model';

/** Abstract notification management service. */
export interface NotificationManagementService {
  getGameTitle(): GameTitle;
  getGroupNotifications$(lspGroupId: BigNumber): Observable<GroupNotification[]>;
  postEditLspGroupCommunityMessage$(
    notificationId: string,
    communityMessage: CommunityMessage,
  ): Observable<void>;
  deleteLspGroupCommunityMessage$(notificationId: string): Observable<void>;
}
