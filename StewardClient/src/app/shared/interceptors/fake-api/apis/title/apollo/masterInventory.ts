import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import faker from '@faker-js/faker';
import { ApolloMasterInventory } from '@models/apollo';
import { MasterInventoryItem } from '@models/master-inventory-item';

/** Fake API for getting master inventory. */
export class ApolloMasterInventoryFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/apollo\/masterInventory$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): ApolloMasterInventory {
    return ApolloMasterInventoryFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): ApolloMasterInventory {
    return {
      creditRewards: new Array(faker.datatype.number(5)).fill(undefined).map(_ => {
        return <MasterInventoryItem>{
          id: fakeBigNumber(),
          description: faker.lorem.sentence(1),
          itemType: faker.lorem.word(2),
          quantity: faker.datatype.number(),
        };
      }),
      cars: new Array(faker.datatype.number(5)).fill(undefined).map(_ => {
        return <MasterInventoryItem>{
          id: fakeBigNumber(),
          description: faker.lorem.sentence(1),
          itemType: faker.lorem.word(2),
          quantity: faker.datatype.number(),
        };
      }),
      vanityItems: new Array(faker.datatype.number(5)).fill(undefined).map(_ => {
        return <MasterInventoryItem>{
          id: fakeBigNumber(),
          description: faker.lorem.sentence(1),
          itemType: faker.lorem.word(2),
          quantity: faker.datatype.number(),
        };
      }),
    };
  }
}
