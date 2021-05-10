import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { WoodstockProfileRollback } from '@models/woodstock';
import * as faker from 'faker';

/** Fake API for finding User Flags. */
export class WoodstockPlayerXuidProfileRollbacksApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/woodstock\/player\/xuid\((\d+)\)\/profileRollbacks$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): WoodstockProfileRollback[] {
    return WoodstockPlayerXuidProfileRollbacksApi.makeMany();
  }

  /** Create many example models. */
  public static makeMany(): WoodstockProfileRollback[] {
    return new Array(faker.datatype.number({ min: 1, max: 5 })).fill(undefined).map(
      () =>
        <WoodstockProfileRollback>{
          dateUtc: faker.date.past(),
          author: 'System',
          details: faker.random.words(10),
        },
    );
  }
}
