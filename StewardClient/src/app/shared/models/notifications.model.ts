import BigNumber from 'bignumber.js';
import { DateTime } from 'luxon';

/** An individual return element for endpoint `api/v1/title/{title}/player/xuid(...)/notifications` */
export interface PlayerNotification {
  notificationType: string;
  isRead: boolean;
  notificationId: string;
  sendDateUtc: DateTime;
  expirationDateUtc: DateTime;
}

/** An individual return element for endpoint `api/v1/title/{title}/group/groupId(...)/notifications` */
export interface GroupNotification {
  message: string;
  notificationId: string;
  sentDateUtc: DateTime;
  expirationDateUtc: DateTime;
  hasDeviceType: boolean;
  deviceType: string;
  notificationType: string;
  groupId: BigNumber;
}

/** The return type for endpoint `api/v1/title/{title}/player/xuid(...)/notifications` */
export type PlayerNotifications = PlayerNotification[];

/** The return type for endpoint `api/v1/title/{title}/group/groupId(...))/notifications` */
export type GroupNotifications = GroupNotification[];
