import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { ApolloPlayerDetails } from '@models/apollo';
import { Unprocessed } from '@models/unprocessed';

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
  public handle(): Partial<Unprocessed<ApolloPlayerDetails>> {
    return ApolloPlayerGamertagDetailsFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): Partial<Unprocessed<ApolloPlayerDetails>> {
    return {
      xuid: BigInt(189456456),
      gamertag: 'apollo-gamertag',
      country: 'United States',
      region: 'Washington',
      // these are all responses from the old API and aren't actually used by the new UI
      // firstLogin: '0001-01-01T00:00:00',
      // lastLogin: '0001-01-01T00:00:00',
      // region: BigInt(1),
      // country: BigInt(0),
      // lcid: BigInt(0),
      // ipAddress: null,
      // ageGroup: BigInt(0),
      // subscriptionTier: null,
      // lastGameSettingsUsed: '00000000-0000-0000-0000-000000000000',
      // timeOffsetInSeconds: BigInt(0),
      // userInventoryId: '00000000-0000-0000-0000-000000000000',
      // userInventoryIdHistory: null,
      // profileDetails: null,
      // blueprintThreadLevel: BigInt(1),
      // clubId: '',
      // clubTag: '',
      // currentBadgeId: BigInt(326),
      // currentCareerLevel: BigInt(288424),
      // currentDriverModelId: BigInt(12),
      // currentPlayerTitleId: BigInt(326),
      // customizationSlots: [
      //   -1,
      //   -1,
      //   410,
      //   1000,
      //   10,
      //   6,
      //   1001,
      //   1002,
      //   -1,
      //   -1,
      //   1003,
      //   1005,
      //   1004,
      //   1006,
      //   -1,
      //   -1,
      //   -1,
      //   -1,
      //   -1,
      //   -1,
      // ],
      // flags: BigInt(0),
      // licensePlate: '  TEMP  ',
      // painterThreadLevel: BigInt(1),
      // photoThreadLevel: BigInt(1),
      // qwXuid: BigInt(2535460485267489),
      // roleInClub: 'Invalid',
      // roleInTeam: 'Invalid',
      // teamId: '',
      // teamTag: '',
      // tunerThreadLevel: BigInt(1),
      // wzGamertag: 'temporary1021',
      // isFeaturedDrivatar: false,
      // isFeaturedPhotographer: false,
      // isFeaturedTuner: false,
      // isFeaturedPainter: false,
      // isFlaggedForSuspiciousActivity: false,
      // isCommunityManager: false,
      // isUserUnderReview: false,
      // isOnWhitelist: false,
      // isTurn10Employee: false,
      // isVip: false,
      // acceptsClubInvites: false,
      // clubTopTierCount: BigInt(0),
      // userAgeGroup: BigInt(0),
      // isFeaturedCommentator: false,
      // currentCarCollectionScore: BigInt(0),
      // currentCarCollectionTier: BigInt(0),
      // currentProfileId: BigInt(0),
      // equippedVanityItemId: BigInt(0),
      // environment: null,
    };
  }
}
