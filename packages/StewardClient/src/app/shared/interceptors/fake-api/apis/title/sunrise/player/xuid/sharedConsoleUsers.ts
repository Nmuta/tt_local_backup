import { environment } from '@environments/environment';
import faker from '@faker-js/faker';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { SunriseSharedConsoleUser } from '@models/sunrise';
import BigNumber from 'bignumber.js';

/** Fake API for finding User Flags. */
export class SunrisePlayerXuidConsoleSharedConsoleUsersFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/sunrise\/player\/xuid\((\d+)\)\/sharedConsoleUsers$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): SunriseSharedConsoleUser[] {
    return SunrisePlayerXuidConsoleSharedConsoleUsersFakeApi.makeMany();
  }

  /** Creates a sample response. */
  public static makeMany(): SunriseSharedConsoleUser[] {
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
