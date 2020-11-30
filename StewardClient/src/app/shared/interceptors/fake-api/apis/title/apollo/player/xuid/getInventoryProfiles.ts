import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { ApolloPlayerInventory } from '@models/apollo';
import { Unprocessed } from '@models/unprocessed';

/** Fake API for apollo player inventory profiles. */
export class ApolloPlayerXuidInventoryProfilesFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    if(this.request.method.toUpperCase() !== 'GET') {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /\/?api\/v1\/title\/apollo\/player\/xuid\((.+)\)\/inventoryProfiles/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): Partial<Unprocessed<ApolloPlayerInventory>> {
    return ApolloPlayerXuidInventoryProfilesFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): Partial<Unprocessed<ApolloPlayerInventory>> {
    return {
      xuid: 189456456,
    };
  }
}
