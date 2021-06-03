import BigNumber from 'bignumber.js';
import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { GravityPlayerDetails } from '@models/gravity';
import { fakeBigNumber, faker } from '@interceptors/fake-api/utility';
import { fakeT10Id } from '@interceptors/fake-api/utility/fake-t10id';
import { toDateTime } from '@helpers/luxon';

/** Fake API for finding User Flags. */
export class GravityPlayerGamertagDetailsFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/gravity\/player\/gamertag\((.+)\)\/details$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): GravityPlayerDetails {
    return GravityPlayerGamertagDetailsFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): GravityPlayerDetails {
    return {
      xuid: new BigNumber(189456456),
      gamertag: 'gravity-gamertag',
      country: fakeBigNumber(),
      region: fakeBigNumber(),
      ageGroup: fakeBigNumber(),
      firstLoginUtc: toDateTime(faker.date.past(2)),
      lastLoginUtc: toDateTime(faker.date.past(1)),
      ipAddress: faker.internet.ip(),
      lastGameSettingsUsed: faker.datatype.uuid(),
      lcid: fakeBigNumber(),
      playFabId: faker.datatype.uuid(),
      saveStates: [],
      subscriptionTier: faker.datatype.uuid(),
      t10Id: fakeT10Id(),
      timeOffsetInSeconds: fakeBigNumber(),
      userInventoryId: faker.datatype.uuid(),
    };
  }
}
