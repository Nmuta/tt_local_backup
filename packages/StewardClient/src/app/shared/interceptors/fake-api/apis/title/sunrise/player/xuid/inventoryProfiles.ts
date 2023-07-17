import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import faker from '@faker-js/faker';
import { PlayerInventoryProfileWithDeviceType } from '@models/player-inventory-profile';
import { DeviceType } from '@models/enums';

/** Fake API for sunrise player inventory profiles. */
export class SunrisePlayerXuidInventoryProfilesFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/sunrise\/player\/xuid\((.+)\)\/inventoryProfiles$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): PlayerInventoryProfileWithDeviceType[] {
    return SunrisePlayerXuidInventoryProfilesFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): PlayerInventoryProfileWithDeviceType[] {
    const items = Array(faker.datatype.number({ min: 1, max: 5 }))
      .fill(undefined)
      .map(() => {
        return {
          profileId: fakeBigNumber(),
          externalProfileId: faker.datatype.uuid(),
          isCurrent: false,
          deviceType: DeviceType.Steam,
        };
      });

    faker.random.arrayElement(items).isCurrent = true;

    return items;
  }
}
