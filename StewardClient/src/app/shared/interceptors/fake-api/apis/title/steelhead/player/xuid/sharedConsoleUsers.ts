import BigNumber from 'bignumber.js';
import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { SteelheadSharedConsoleUser } from '@models/steelhead';
import faker from '@faker-js/faker';

/** Fake API for finding User Flags. */
export class SteelheadPlayerXuidConsoleSharedConsoleUsersFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/steelhead\/player\/xuid\((\d+)\)\/sharedConsoleUsers$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): SteelheadSharedConsoleUser[] {
    return SteelheadPlayerXuidConsoleSharedConsoleUsersFakeApi.makeMany();
  }

  /** Creates a sample response. */
  public static makeMany(): SteelheadSharedConsoleUser[] {
    return [
      {
        sharedConsoleId: new BigNumber(faker.datatype.number()),
        xuid: new BigNumber(faker.datatype.number()),
        gamertag: faker.random.word(),
        everBanned: faker.datatype.boolean(),
      },
    ];
  }
}
