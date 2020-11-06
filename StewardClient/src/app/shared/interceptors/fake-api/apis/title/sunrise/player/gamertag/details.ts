import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { SunrisePlayerDetails } from '@models/sunrise';
import { Unprocessed } from '@models/unprocessed';

/** Fake API for finding User Flags. */
export class SunrisePlayerGamertagDetailsFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(
      environment.stewardApiUrl
    );
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /\/?api\/v2\/title\/sunrise\/player\/gamertag\((.+)\)\/details/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): object {
    return SunrisePlayerGamertagDetailsFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): Partial<Unprocessed<SunrisePlayerDetails>> {
    return {
      xuid: 189456456,
      gamertag: 'test-gamertag',
      licensePlate: 'HORIZON',
      region: 'United States',
      currentCareerLevel: '13'
      // these are all responses from the old API and aren't actually used by the new UI
      // firstLogin: '0001-01-01T00:00:00',
      // lastLogin: '0001-01-01T00:00:00',
      // region: 1,
      // country: 0,
      // lcid: 0,
      // ipAddress: null,
      // ageGroup: 0,
      // subscriptionTier: null,
      // lastGameSettingsUsed: '00000000-0000-0000-0000-000000000000',
      // timeOffsetInSeconds: 0,
      // userInventoryId: '00000000-0000-0000-0000-000000000000',
      // userInventoryIdHistory: null,
      // profileDetails: null,
      // blueprintThreadLevel: 1,
      // clubId: '',
      // clubTag: '',
      // currentBadgeId: 326,
      // currentCareerLevel: 288424,
      // currentDriverModelId: 12,
      // currentPlayerTitleId: 326,
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
      // flags: 0,
      // licensePlate: '  TEMP  ',
      // painterThreadLevel: 1,
      // photoThreadLevel: 1,
      // qwXuid: 2535460485267489,
      // roleInClub: 'Invalid',
      // roleInTeam: 'Invalid',
      // teamId: '',
      // teamTag: '',
      // tunerThreadLevel: 1,
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
      // clubTopTierCount: 0,
      // userAgeGroup: 0,
      // isFeaturedCommentator: false,
      // currentCarCollectionScore: 0,
      // currentCarCollectionTier: 0,
      // currentProfileId: 0,
      // equippedVanityItemId: 0,
      // environment: null,
    };
  }
}
