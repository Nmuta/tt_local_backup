import { environment } from '@environments/environment';
import faker from '@faker-js/faker';
import { toDateTime } from '@helpers/luxon';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { fakeBigNumber, fakeXuid } from '@interceptors/fake-api/utility';
import { LeaderboardScore } from '@models/leaderboards';
import BigNumber from 'bignumber.js';

/** Fake API for getting leaderboard scores near a player XUID. */
export class WoodstockLeaderboardScoresNearPlayerXuidTopFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/woodstock\/leaderboard\/scores\/near-player\/(\d+)$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): LeaderboardScore[] {
    return WoodstockLeaderboardScoresNearPlayerXuidTopFakeApi.make();
  }

  /** Generates a sample object */
  public static make(min: number = 5, max: number = 20): LeaderboardScore[] {
    function makeFakeLeaderboardScores(max: number): LeaderboardScore[] {
      let count = 1;
      return Array(faker.datatype.number({ min: min, max: max }))
        .fill(undefined)
        .map(() => {
          return {
            position: new BigNumber(count++),
            xuid: fakeXuid(),
            id: faker.datatype.uuid(),
            submissionTimeUtc: toDateTime(faker.date.past()),
            score: fakeBigNumber({ min: 100000000, max: 999999999 }),
            carClass: faker.random.word(),
            carPerformanceIndex: fakeBigNumber(),
            car: faker.random.words(2),
            carDriveType: faker.random.words(2),
            track: faker.random.words(2),
            isClean: faker.datatype.boolean(),
            stabilityManagement: faker.datatype.boolean(),
            antiLockBrakingSystem: faker.datatype.boolean(),
            tractionControlSystem: faker.datatype.boolean(),
            automaticTransmission: faker.datatype.boolean(),
            deviceType: faker.random.word(),
          };
        });
    }

    return makeFakeLeaderboardScores(max);
  }
}
