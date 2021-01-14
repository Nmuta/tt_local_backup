import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { faker } from '@interceptors/fake-api/utility';
import { SunrisePlayerNotification } from '@models/sunrise';
import { Unprocessed } from '@models/unprocessed';

/** Fake API for sunrise player inventory profiles. */
export class SunrisePlayerXuidNotificationsFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /\/?api\/v1\/title\/sunrise\/player\/xuid\((.+)\)\/notifications/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): Unprocessed<SunrisePlayerNotification[]> {
    return SunrisePlayerXuidNotificationsFakeApi.makeMany();
  }

  /** Generates a sample object */
  public static makeMany(): Unprocessed<SunrisePlayerNotification[]> {
    return new Array(faker.random.number({min: 5, max: 20})).fill(null).map(_ => {
      return {
        expirationDateUtc: faker.date.future().toISOString(),
        sendDateUtc: faker.date.past().toISOString(),
        isRead: faker.random.boolean(),
        notificationId: faker.random.uuid(),
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
