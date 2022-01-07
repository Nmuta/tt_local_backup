import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { GravityPlayerInventory } from '@models/gravity';
import { GravityPlayerXuidInventoryFakeApi } from '../inventory';

/** Fake API for gravity player inventory. */
export class GravityPlayerXuidProfileIdInventoryFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex =
      /^\/?api\/v1\/title\/gravity\/player\/xuid\((.+)\)\/profileId\((.+)\)\/inventory$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): GravityPlayerInventory {
    return GravityPlayerXuidProfileIdInventoryFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): GravityPlayerInventory {
    return GravityPlayerXuidInventoryFakeApi.make();
  }
}
