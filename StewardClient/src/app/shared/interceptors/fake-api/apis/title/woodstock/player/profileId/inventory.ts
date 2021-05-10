import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { WoodstockMasterInventory } from '@models/woodstock';
import { WoodstockPlayerXuidInventoryFakeApi } from '../xuid/inventory';

/** Fake API for woodstock player inventory. */
export class WoodstockPlayerProfileIdInventoryFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/woodstock\/player\/profileId\((.+)\)\/inventory$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): WoodstockMasterInventory {
    return WoodstockPlayerProfileIdInventoryFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): WoodstockMasterInventory {
    return WoodstockPlayerXuidInventoryFakeApi.make(null);
  }
}
