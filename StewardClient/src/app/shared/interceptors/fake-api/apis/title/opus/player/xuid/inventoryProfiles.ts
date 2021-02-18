import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { fakeBigInt, faker } from '@interceptors/fake-api/utility';
import { OpusPlayerInventory, OpusPlayerInventoryProfile } from '@models/opus';
import { Unprocessed } from '@models/unprocessed';

/** Fake API for apollo player inventory profiles. */
export class OpusPlayerXuidInventoryProfilesFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    if (this.request.method.toUpperCase() !== 'GET') {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/opus\/player\/xuid\((.+)\)\/inventoryProfiles$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): OpusPlayerInventoryProfile[] {
    return OpusPlayerXuidInventoryProfilesFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): OpusPlayerInventoryProfile[] {
    const items = Array(faker.random.number({min: 1, max: 5})).fill(undefined).map(() => {
      return {
        profileId: fakeBigInt(),
        isCurrent: false,
      }
    });

    faker.random.arrayElement(items).isCurrent = true;

    return items;
  }
}
