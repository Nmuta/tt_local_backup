import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import { DetailedCar } from '@models/detailed-car';
import faker from 'faker';

/** Fake API for getting kusto cars. */
export class WoodstockDetailedCarsFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/woodstock\/kusto\/cars$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): DetailedCar[] {
    return WoodstockDetailedCarsFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): DetailedCar[] {
    function makeFakeDetailedCars(count: number): DetailedCar[] {
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

    return makeFakeDetailedCars(20);
  }
}
