import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { KustoQueryResponse } from '@models/kusto';
import faker from 'faker';

/** Fake API for running a kusto query. */
export class KustoRunQueryFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/kusto\/query\/run$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): KustoQueryResponse {
    return KustoRunQueryFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): KustoQueryResponse {
    const fakeResponse = [];
    for (let i = 0; i < 100; i++) {
      fakeResponse[i] = {
        note: 'THIS IS FAKE DATA',
        id: faker.random.number(),
        xuid: faker.random.uuid(),
        gamertag: faker.random.words(3),
        t10Id: faker.random.uuid(),
        foo: 'bar',
        duct: 'tape',
        doOrDoNot: 'there is no try',
        mayTheForce: 'be with you',
        justKeepSwimming: 'nemo',
        imGoingTo: 'make him an offer he cannot refuse',
        toto: 'Ive got a feeling we are not in Kansas anymore.',
      };
    }

    return fakeResponse;
  }
}
