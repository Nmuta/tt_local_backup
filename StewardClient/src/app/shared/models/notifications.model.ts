import BigNumber from 'bignumber.js';
import { DateTime } from 'luxon';
import { GuidLikeString } from './extended-types';

/** An individual return element for endpoint `api/v1/title/{title}/player/xuid(...)/notifications` */
export interface PlayerNotification {
  message: string;
  notificationId: GuidLikeString;
  notificationType: string;
  sentDateUtc: DateTime;
  expirationDateUtc: DateTime;
  isRead: boolean;
}

/** An individual return element for endpoint `api/v1/title/{title}/player/xuid(...)/notifications` */
export interface LocalizedPlayerNotification extends PlayerNotification {
  title: string;
}

/** An individual return element for endpoint `api/v1/title/{title}/group/groupId(...)/notifications` */
export interface GroupNotification {
  groupId: BigNumber;
  message: string;
  notificationId: GuidLikeString;
  notificationType: string;
  sentDateUtc: DateTime;
  expirationDateUtc: DateTime;
  hasDeviceType: boolean;
  deviceType: string;
}

/** An individual return element for endpoint `api/v1/title/{title}/player/xuid(...)/notifications` */
export interface LocalizedGroupNotification extends GroupNotification {
  title: string;
}
