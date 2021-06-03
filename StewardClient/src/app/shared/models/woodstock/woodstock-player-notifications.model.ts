import { DateTime } from 'luxon';

/** An individual return element for endpoint `api/v1/title/woodstock/player/xuid(...)/notifications` */
export interface WoodstockPlayerNotification {
  notificationType: string;
  isRead: boolean;
  notificationId: string;
  sendDateUtc: DateTime;
  expirationDateUtc: DateTime;
}

/** The return type for endpoint `api/v1/title/woodstock/player/xuid(...)/notifications` */
export type WoodstockPlayerNotifications = WoodstockPlayerNotification[];
