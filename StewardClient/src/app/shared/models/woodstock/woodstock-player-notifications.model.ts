/** An individual return element for endpoint `api/v1/title/woodstock/player/xuid(...)/notifications` */
export interface WoodstockPlayerNotification {
  notificationType: string;
  isRead: boolean;
  notificationId: string;
  sendDateUtc: Date;
  expirationDateUtc: Date;
}

/** The return type for endpoint `api/v1/title/woodstock/player/xuid(...)/notifications` */
export type WoodstockPlayerNotifications = WoodstockPlayerNotification[];
