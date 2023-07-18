import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { GameTitleCodeName } from '@models/enums';
import { KustoQueries } from '@models/kusto/kusto-queries';
import faker from '@faker-js/faker';

/** Fake API for getting kusto predefined queries. */
export class KustoGetQueriesFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/kusto\/queries$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): KustoQueries {
    return KustoGetQueriesFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): KustoQueries {
    return [
      {
        id: faker.datatype.uuid(),
        name: 'Test Query 1',
        query: 'Test Query 1',
        title: GameTitleCodeName.FH5,
      },
      {
        id: faker.datatype.uuid(),
        name: 'Test Query 2',
        query: 'Test Query 2',
        title: GameTitleCodeName.FH4,
      },
      {
        id: faker.datatype.uuid(),
        name: 'Test Query 3',
        query: 'Test Query 3',
        title: GameTitleCodeName.FH4,
      },
      {
        id: faker.datatype.uuid(),
        name: 'Test Query 6',
        query: 'Test Query 6',
        title: GameTitleCodeName.FH4,
      },
      {
        id: faker.datatype.uuid(),
        name: 'Test Query 9',
        query: 'Test Query 9',
        title: GameTitleCodeName.FM7,
      },
      {
        id: faker.datatype.uuid(),
        name: 'Test Query 10',
        query: 'Test Query 10',
        title: GameTitleCodeName.FM7,
      },
      {
        id: faker.datatype.uuid(),
        name: 'Test Query 7',
        query: 'Test Query 7',
        title: GameTitleCodeName.FH3,
      },
      {
        id: faker.datatype.uuid(),
        name: 'Test Query 8',
        query: 'Test Query 8',
        title: GameTitleCodeName.FH3,
      },
    ];
  }
}
