import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { fakeBigNumber, faker } from '@interceptors/fake-api/utility';
import { SteelheadPlayerInventoryProfile } from '@models/steelhead';

/** Fake API for steelhead player inventory profiles. */
export class SteelheadPlayerXuidInventoryProfilesFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/steelhead\/player\/xuid\((.+)\)\/inventoryProfiles$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): SteelheadPlayerInventoryProfile[] {
    return SteelheadPlayerXuidInventoryProfilesFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): SteelheadPlayerInventoryProfile[] {
    const items = Array(faker.random.number({ min: 1, max: 5 }))
      .fill(undefined)
      .map(() => {
        return {
          profileId: fakeBigNumber(),
          externalProfileId: faker.random.uuid(),
          isCurrent: false,
        };
      });

    faker.random.arrayElement(items).isCurrent = true;

    return items;
  }
}
