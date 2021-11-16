import { environment } from '@environments/environment';
import { toDateTime } from '@helpers/luxon';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { faker } from '@interceptors/fake-api/utility';
import { PlayerNotification } from '@models/notifications.model';

/** Fake API for sunrise player inventory profiles. */
export class SunrisePlayerXuidNotificationsFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/sunrise\/player\/xuid\((.+)\)\/notifications$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): PlayerNotification[] {
    return SunrisePlayerXuidNotificationsFakeApi.makeMany();
  }

  /** Generates a sample object */
  public static makeMany(): PlayerNotification[] {
    return new Array(faker.datatype.number({ min: 5, max: 20 })).fill(null).map(_ => {
      return <PlayerNotification>{
        expirationDateUtc: toDateTime(faker.date.future()),
        sentDateUtc: toDateTime(faker.date.past()),
        message: faker.datatype.string(),
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
