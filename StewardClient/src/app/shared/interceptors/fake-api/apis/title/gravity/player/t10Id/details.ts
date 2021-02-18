import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { fakeBigInt, fakeGamertag, faker, fakeXuid } from '@interceptors/fake-api/utility';
import { GuidLikeString } from '@models/extended-types';
import { GravityPlayerDetails, GravitySaveState } from '@models/gravity';
import { chain } from 'lodash';

/** Fake API for finding User Flags. */
export class GravityPlayerT10IdDetailsFakeApi extends FakeApiBase {
  private t10Id: GuidLikeString;

  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/gravity\/player\/t10Id\((.+)\)\/details$/i;
    const isMatch = regex.test(url.pathname);
    if (!isMatch) {
      return false;
    }

    const match = url.pathname.match(regex);
    this.t10Id = match[1];
    return true;
  }

  /** Produces a sample API response. */
  public handle(): GravityPlayerDetails {
    return GravityPlayerT10IdDetailsFakeApi.make(this.t10Id);
  }

  /** Generates a sample object */
  public static make(t10id: GuidLikeString): GravityPlayerDetails {
    const model = {
      xuid: fakeXuid(),
      gamertag: fakeGamertag(),
      ageGroup: fakeBigInt(),
      country: fakeBigInt(),
      firstLoginUtc: faker.date.past(1),
      ipAddress: faker.internet.ip(),
      lastGameSettingsUsed: faker.random.uuid(),
      lastLoginUtc: faker.date.recent(7),
      lcid: fakeBigInt(),
      playFabId: faker.random.uuid(),
      region: fakeBigInt(),
      subscriptionTier: faker.random.uuid(),
      t10Id: t10id,
      timeOffsetInSeconds: fakeBigInt(),
      userInventoryId: faker.random.uuid(),
      saveStates: Array(10).fill(undefined).map(() => {
        return <GravitySaveState>{
          lastLoginUtc: faker.date.recent(180),
          userInventoryId: faker.random.uuid(),
        }
      }),
    };
    model.userInventoryId = chain(model.saveStates).sortBy(v => v.lastLoginUtc).reverse().first().value().userInventoryId;
    return model;
  }
}
