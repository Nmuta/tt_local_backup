import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { ApolloPlayerInventory } from '@models/apollo';
import { ApolloPlayerXuidInventoryFakeApi } from '../xuid/inventory';

/** Fake API for apollo player inventory. */
export class ApolloPlayerProfileIdInventoryFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/apollo\/player\/profileId\((.+)\)\/inventory$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): ApolloPlayerInventory {
    return ApolloPlayerProfileIdInventoryFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): ApolloPlayerInventory {
    return ApolloPlayerXuidInventoryFakeApi.make(null);
  }
}
