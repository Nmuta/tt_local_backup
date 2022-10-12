import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import { SimpleCar } from '@models/cars';
import faker from '@faker-js/faker';

/** Fake API for getting kusto cars. */
export class ApolloSimpleCarsFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/apollo\/kusto\/cars$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): SimpleCar[] {
    return ApolloSimpleCarsFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): SimpleCar[] {
    function makeFakeSimpleCars(count: number): SimpleCar[] {
      return Array(faker.datatype.number({ min: 5, max: count }))
        .fill(undefined)
        .map(() => {
          return {
            id: fakeBigNumber(),
            makeId: fakeBigNumber(),
            make: faker.random.word(),
            model: faker.random.words(3),
            makeOnly: false,
          };
        });
    }

    return makeFakeSimpleCars(20);
  }
}
