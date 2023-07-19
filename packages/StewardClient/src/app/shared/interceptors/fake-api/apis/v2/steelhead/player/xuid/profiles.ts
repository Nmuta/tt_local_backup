import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import faker from '@faker-js/faker';
import { FullPlayerInventoryProfile } from '@models/player-inventory-profile';
import { DeviceType } from '@models/enums';

/** Fake API for woodstock player inventory profiles. */
export class SteelheadPlayerInventoryProfilesFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v2\/title\/steelhead\/player\/xuid\((.+)\)\/profiles$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): FullPlayerInventoryProfile[] {
    return SteelheadPlayerInventoryProfilesFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): FullPlayerInventoryProfile[] {
    const items = Array(faker.datatype.number({ min: 1, max: 5 }))
      .fill(undefined)
      .map(() => {
        return {
          profileId: fakeBigNumber(),
          externalProfileId: faker.datatype.uuid(),
          isCurrent: false,
          deviceType: DeviceType.Steam,
        } as FullPlayerInventoryProfile;
      });

    faker.random.arrayElement(items).isCurrentByTitleId = true;

    return items;
  }
}
