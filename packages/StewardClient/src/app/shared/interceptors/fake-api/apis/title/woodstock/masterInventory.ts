import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { WoodstockMasterInventory } from '@models/woodstock';

/** Fake API for getting master inventory. */
export class WoodstockMasterInventoryFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/woodstock\/masterInventory$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): WoodstockMasterInventory {
    return WoodstockMasterInventoryFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): WoodstockMasterInventory {
    return {
      creditRewards: [],
      cars: [],
      carHorns: [],
      vanityItems: [],
      quickChatLines: [],
      emotes: [],
    };
  }
}
