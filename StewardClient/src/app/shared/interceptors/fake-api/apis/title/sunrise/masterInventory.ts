import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { SunriseMasterInventory } from '@models/sunrise';

/** Fake API for getting master inventory. */
export class SunriseMasterInventoryFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/sunrise\/masterInventory$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): SunriseMasterInventory {
    return SunriseMasterInventoryFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): SunriseMasterInventory {
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
