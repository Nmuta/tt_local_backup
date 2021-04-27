import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { ApolloPlayerInventory } from '@models/apollo';
import { fakeBigNumber, faker } from '@interceptors/fake-api/utility';

/** Fake API for sunrise player inventory. */
export class ApolloGroupGroupIdInventoryFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    if (this.request.method.toUpperCase() !== 'POST') {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/apollo\/group\/groupId\((.+)\)\/inventory$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): ApolloPlayerInventory {
    return ApolloGroupGroupIdInventoryFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): ApolloPlayerInventory {
    return {
      xuid: fakeBigNumber(),
      badges: [],
      cars: [],
      credits: fakeBigNumber(),
      giftReason: faker.lorem.sentence(),
      mods: [],
      packs: [],
      vanityItems: [],
    };
  }
}
