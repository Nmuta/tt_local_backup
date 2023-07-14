import BigNumber from 'bignumber.js';
import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { SteelheadPlayerDetails } from '@models/steelhead';
import faker from '@faker-js/faker';

/** Fake API for finding User Flags. */
export class SteelheadPlayerGamertagDetailsFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/steelhead\/player\/gamertag\((.+)\)\/details$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): SteelheadPlayerDetails {
    return SteelheadPlayerGamertagDetailsFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): SteelheadPlayerDetails {
    return {
      xuid: new BigNumber(189456456),
      gamertag: 'steelhead-gamertag',
      country: new BigNumber(faker.datatype.number(50)),
      region: new BigNumber(faker.datatype.number(20)),
      currentProfileId: undefined,
      subscriptionTier: undefined,
      ageGroup: undefined,
      lcid: undefined,
      ipAddress: undefined,
      lastLoginUtc: undefined,
      firstLoginUtc: undefined,
      currentDriverModelId: undefined,
      currentPlayerTitleId: undefined,
      currentBadgeId: undefined,
      clubTag: undefined,
      clubId: undefined,
      roleInClub: undefined,
      currentCareerLevel: undefined,
      equippedVanityItemId: undefined,
      currentCarCollectionTier: undefined,
      currentCarCollectionScore: undefined,
    };
  }
}
