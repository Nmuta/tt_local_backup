/** An individual return element for endpoint `api/v1/title/sunrise/player/xuid(...)/notifications` */
export interface SunrisePlayerNotification {
  notificationType: string;
  isRead: boolean;
  notificationId: string;
  sendDateUtc: Date;
  expirationDateUtc: Date;
}

/** The return type for endpoint `api/v1/title/sunrise/player/xuid(...)/notifications` */
export type SunrisePlayerNotifications = SunrisePlayerNotification[];
