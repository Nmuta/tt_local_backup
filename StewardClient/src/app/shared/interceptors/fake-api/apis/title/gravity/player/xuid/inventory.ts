import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { GravityPlayerInventory } from '@models/gravity';
import { Unprocessed } from '@models/unprocessed';

/** Fake API for gravity player inventory. */
export class GravityPlayerXuidInventoryFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/gravity\/player\/xuid\((.+)\)\/inventory$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): Partial<Unprocessed<GravityPlayerInventory>> {
    return GravityPlayerXuidInventoryFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): Partial<Unprocessed<GravityPlayerInventory>> {
    return {
      xuid: BigInt(2533275026603041),
    };
  }
}
