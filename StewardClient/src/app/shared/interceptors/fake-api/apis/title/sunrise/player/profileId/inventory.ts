import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { SunriseMasterInventory } from '@models/sunrise/sunrise-master-inventory.model';
import { SunrisePlayerXuidInventoryFakeApi } from '../xuid/inventory';

/** Fake API for sunrise player inventory. */
export class SunrisePlayerProfileIdInventoryFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/sunrise\/player\/profileId\((.+)\)\/inventory$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): SunriseMasterInventory {
    return SunrisePlayerProfileIdInventoryFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): SunriseMasterInventory {
    return SunrisePlayerXuidInventoryFakeApi.make(null);
  }
}
