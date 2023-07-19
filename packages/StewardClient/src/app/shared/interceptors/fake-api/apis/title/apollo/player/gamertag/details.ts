import BigNumber from 'bignumber.js';
import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { ApolloPlayerDetails } from '@models/apollo';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import faker from '@faker-js/faker';
import { toDateTime } from '@helpers/luxon';

/** Fake API for finding User Flags. */
export class ApolloPlayerGamertagDetailsFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/apollo\/player\/gamertag\((.+)\)\/details$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): ApolloPlayerDetails {
    return ApolloPlayerGamertagDetailsFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): ApolloPlayerDetails {
    return {
      xuid: new BigNumber(189456456),
      gamertag: 'apollo-gamertag',
      country: fakeBigNumber(),
      region: fakeBigNumber(),
      ageGroup: faker.datatype.uuid(),
      clubId: faker.datatype.uuid(),
      clubTag: faker.lorem.word(),
      currentBadgeId: faker.datatype.uuid(),
      currentCarCollectionScore: fakeBigNumber(),
      currentCarCollectionTier: faker.datatype.uuid(),
      currentCareerLevel: fakeBigNumber(),
      currentDriverModelId: fakeBigNumber(),
      currentPlayerTitleId: faker.datatype.uuid(),
      currentProfileId: fakeBigNumber(),
      equippedVanityItemId: fakeBigNumber(),
      firstLoginUtc: toDateTime(faker.date.past(2)),
      lastLoginUtc: toDateTime(faker.date.past(1)),
      ipAddress: faker.internet.ip(),
      lcid: fakeBigNumber(),
      roleInClub: faker.datatype.uuid(),
      subscriptionTier: faker.datatype.uuid(),
    };
  }
}
