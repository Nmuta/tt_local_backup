import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { OpusPlayerInventory } from '@models/opus';
import { Unprocessed } from '@models/unprocessed';

/** Fake API for opus player inventory. */
export class OpusPlayerProfileIdInventoryFakeApi extends FakeApiBase {
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
    const regex = /\^\/?api\/v1\/title\/opus\/player\/profileId\((.+)\)\/inventory$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): Partial<Unprocessed<OpusPlayerInventory>> {
    return OpusPlayerProfileIdInventoryFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): Partial<Unprocessed<OpusPlayerInventory>> {
    return {};
  }
}
