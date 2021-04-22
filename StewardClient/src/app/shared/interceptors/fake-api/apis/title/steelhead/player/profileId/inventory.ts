import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { SteelheadMasterInventory } from '@models/steelhead';
import { SteelheadPlayerXuidInventoryFakeApi } from '../xuid/inventory';

/** Fake API for steelhead player inventory. */
export class SteelheadPlayerProfileIdInventoryFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/steelhead\/player\/profileId\((.+)\)\/inventory$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): SteelheadMasterInventory {
    return SteelheadPlayerProfileIdInventoryFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): SteelheadMasterInventory {
    return SteelheadPlayerXuidInventoryFakeApi.make(null);
  }
}
