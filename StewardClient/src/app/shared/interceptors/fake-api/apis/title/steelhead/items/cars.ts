import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import { SimpleCar } from '@models/cars';
import faker from '@faker-js/faker';

/** Fake API for getting kusto cars. */
export class SteelheadSimpleCarsFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v2\/title\/steelhead\/items\/cars$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): SimpleCar[] {
    return SteelheadSimpleCarsFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): SimpleCar[] {
    function makeFakeSimpleCars(count: number): SimpleCar[] {
      return Array(faker.datatype.number({ min: 5, max: count }))
        .fill(undefined)
        .map(() => {
          const tempCar = {
            id: fakeBigNumber(),
            makeId: fakeBigNumber(),
            make: faker.random.word(),
            model: faker.random.words(3),
            year: (Math.random() * (new Date().getFullYear() - 1908) + 1908).toString(),
            displayName: '',
            makeOnly: false,
          };
          tempCar.displayName = `${tempCar.make} ${tempCar.model} (${tempCar.year})`;
          return tempCar;
        });
    }

    return makeFakeSimpleCars(20);
  }
}
