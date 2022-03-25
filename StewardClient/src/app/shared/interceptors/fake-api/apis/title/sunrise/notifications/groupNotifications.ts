import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import faker from '@faker-js/faker';
import { DeviceType } from '@models/enums';
import { toDateTime } from '@helpers/luxon';
import { GroupNotification } from '@models/notifications.model';

/** Fake API for finding User Flags. */
export class SunriseGroupNotificationsFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/sunrise\/group\/groupId\((.+)\)\/notifications$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): GroupNotification[] {
    return SunriseGroupNotificationsFakeApi.make();
  }

  /** Generates a sample object */
  public static make(min: number = 1): GroupNotification[] {
    return new Array(faker.datatype.number({ min: min, max: 10 })).fill(undefined).map(
      () =>
        <GroupNotification>{
          message: faker.random.words(),
          notificationId: faker.datatype.uuid(),
          sentDateUtc: toDateTime(faker.date.soon()),
          expirationDateUtc: toDateTime(faker.date.soon()),
          hasDeviceType: faker.datatype.boolean(),
          deviceType: faker.random.arrayElement(Object.getOwnPropertyNames(DeviceType)),
          notificationType: 'CommunityMessageNotification',
          groupId: fakeBigNumber(),
        },
    );
  }
}
