import BigNumber from 'bignumber.js';
import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { SunrisePlayerDetails } from '@models/sunrise';
import { Unprocessed } from '@models/unprocessed';

/** Fake API for finding User Flags. */
export class SunrisePlayerGamertagDetailsFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/sunrise\/player\/gamertag\((.+)\)\/details$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): Partial<Unprocessed<SunrisePlayerDetails>> {
    return SunrisePlayerGamertagDetailsFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): Partial<Unprocessed<SunrisePlayerDetails>> {
    return {
      xuid: new BigNumber(189456456),
      gamertag: 'sunrise-gamertag',
      licensePlate: 'HORIZON',
      region: 'United States',
      currentCareerLevel: '13',
      // these are all responses from the old API and aren't actually used by the new UI
      // firstLogin: '0001-01-01T00:00:00',
      // lastLogin: '0001-01-01T00:00:00',
      // region: new BigNumber(1),
      // country: new BigNumber(0),
      // lcid: new BigNumber(0),
      // ipAddress: null,
      // ageGroup: new BigNumber(0),
      // subscriptionTier: null,
      // lastGameSettingsUsed: '00000000-0000-0000-0000-000000000000',
      // timeOffsetInSeconds: new BigNumber(0),
      // userInventoryId: '00000000-0000-0000-0000-000000000000',
      // userInventoryIdHistory: null,
      // profileDetails: null,
      // blueprintThreadLevel: new BigNumber(1),
      // clubId: '',
      // clubTag: '',
      // currentBadgeId: new BigNumber(326),
      // currentCareerLevel: new BigNumber(288424),
      // currentDriverModelId: new BigNumber(12),
      // currentPlayerTitleId: new BigNumber(326),
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
      // flags: new BigNumber(0),
      // licensePlate: '  TEMP  ',
      // painterThreadLevel: new BigNumber(1),
      // photoThreadLevel: new BigNumber(1),
      // qwXuid: new BigNumber(2535460485267489),
      // roleInClub: 'Invalid',
      // roleInTeam: 'Invalid',
      // teamId: '',
      // teamTag: '',
      // tunerThreadLevel: new BigNumber(1),
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
      // clubTopTierCount: new BigNumber(0),
      // userAgeGroup: new BigNumber(0),
      // isFeaturedCommentator: false,
      // currentCarCollectionScore: new BigNumber(0),
      // currentCarCollectionTier: new BigNumber(0),
      // currentProfileId: new BigNumber(0),
      // equippedVanityItemId: new BigNumber(0),
      // environment: null,
    };
  }
}
