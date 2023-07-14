import { GameTitle } from '@models/enums';
import { CommunityMessage } from '@models/community-message';
import { Observable } from 'rxjs';
import BigNumber from 'bignumber.js';
import { PlayerNotification } from '@models/notifications.model';

/** Individual notification management contract. */
export interface IndividualNotificationManagementContract {
  /** Get game title. */
  gameTitle: GameTitle;

  /** Get player notifications. */
  getPlayerNotifications$(xuid: BigNumber): Observable<PlayerNotification[]>;

  /** Update player notification. */
  postEditPlayerCommunityMessage$(
    xuid: BigNumber,
    notificationId: string,
    communityMessage: CommunityMessage,
  ): Observable<void>;

  /** Delete player notification. */
  deletePlayerCommunityMessage$(xuid: BigNumber, notificationId: string): Observable<void>;
}
