import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { OpusPlayerDetails } from '@models/opus';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import faker from '@faker-js/faker';
import { toDateTime } from '@helpers/luxon';

/** Fake API for finding User Flags. */
export class OpusPlayerGamertagDetailsFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/opus\/player\/gamertag\((.+)\)\/details$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): OpusPlayerDetails {
    return OpusPlayerGamertagDetailsFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): OpusPlayerDetails {
    return {
      xuid: fakeBigNumber(),
      gamertag: 'opus-gamertag',
      region: fakeBigNumber(),
      country: fakeBigNumber(),
      acceptsClubInvites: faker.datatype.boolean(),
      ageGroup: faker.lorem.word(),
      clubTag: faker.lorem.word(),
      clubTopTierCount: fakeBigNumber(),
      currentBadgeId: faker.datatype.uuid(),
      currentCareerLevel: fakeBigNumber(),
      currentDriverModelId: fakeBigNumber(),
      currentPlayerTitleId: faker.lorem.word(),
      firstLoginUtc: toDateTime(faker.date.past(2)),
      lastLoginUtc: toDateTime(faker.date.past(1)),
      ipAddress: faker.internet.ip(),
      lcid: fakeBigNumber(),
      licensePlate: faker.vehicle.vin(),
      roleInClub: faker.lorem.word(),
      subscriptionTier: faker.lorem.word(),
    };
  }
}
