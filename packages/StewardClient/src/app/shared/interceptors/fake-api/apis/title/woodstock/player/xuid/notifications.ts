import { environment } from '@environments/environment';
import { toDateTime } from '@helpers/luxon';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import faker from '@faker-js/faker';
import { PlayerNotification } from '@models/notifications.model';

/** Fake API for woodstock player inventory profiles. */
export class WoodstockPlayerXuidNotificationsFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/woodstock\/player\/xuid\((.+)\)\/notifications$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): PlayerNotification[] {
    return WoodstockPlayerXuidNotificationsFakeApi.makeMany();
  }

  /** Generates a sample object */
  public static makeMany(): PlayerNotification[] {
    return new Array(faker.datatype.number({ min: 5, max: 20 })).fill(null).map(_ => {
      return <PlayerNotification>{
        message: faker.datatype.string(),
        expirationDateUtc: toDateTime(faker.date.future()),
        sentDateUtc: toDateTime(faker.date.past()),
        isRead: faker.datatype.boolean(),
        notificationId: faker.datatype.uuid(),
        notificationType: faker.random.arrayElement([
          'AuctionHouseFailed',
          'AuctionHouseOutbid',
          'CurationPayout',
          'DrivatarPayout',
          'ForzaFaithfulRewards',
          'GameSettingsRefresh',
          'GiftReceive',
          'HopperPayout',
          'PlayerBusinessPayout',
          'RivalEventBeaten',
          'SetCredits',
          'UserBadgeGranted',
          'NewDlc',
          'Banned',
          'UnBanned',
        ]),
      };
    });
  }
}
