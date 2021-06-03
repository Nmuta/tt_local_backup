import { DateTime } from 'luxon';

/** An individual return element for endpoint `api/v1/title/sunrise/player/xuid(...)/notifications` */
export interface SunrisePlayerNotification {
  notificationType: string;
  isRead: boolean;
  notificationId: string;
  sendDateUtc: DateTime;
  expirationDateUtc: DateTime;
}

/** The return type for endpoint `api/v1/title/sunrise/player/xuid(...)/notifications` */
export type SunrisePlayerNotifications = SunrisePlayerNotification[];
