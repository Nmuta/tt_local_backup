import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import { WoodstockPlayerAccountInventory } from '@models/woodstock';

/** Fake API for finding player account inventory items for a XUID. */
export class WoodstockPlayerXuidAccountInventoryFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/woodstock\/player\/xuid\((\d+)\)\/accountInventory$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): WoodstockPlayerAccountInventory {
    return WoodstockPlayerXuidAccountInventoryFakeApi.make();
  }

  /** Creates a sample response. */
  public static make(): WoodstockPlayerAccountInventory {
    return {
      backstagePasses: fakeBigNumber({ min: 0, max: 1000 }),
    } as WoodstockPlayerAccountInventory;
  }
}
