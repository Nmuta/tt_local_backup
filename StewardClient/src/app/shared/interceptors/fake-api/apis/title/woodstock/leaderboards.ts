import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import { Leaderboard } from '@models/leaderboards';
import faker from 'faker';

/** Fake API for getting leaderboards. */
export class WoodstockLeaderboardsFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/woodstock\/leaderboards$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): Leaderboard[] {
    return WoodstockLeaderboardsFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): Leaderboard[] {
    function makeFakeLeaderboards(count: number): Leaderboard[] {
      return Array(faker.datatype.number({ min: 5, max: count }))
        .fill(undefined)
        .map(() => {
          return {
            name: faker.datatype.string.name,
            gameScoreboardId: fakeBigNumber(),
            trackId: fakeBigNumber(),
            scoreboardTypeId: fakeBigNumber(),
            scoreboardType: faker.random.words(2),
            scoreTypeId: fakeBigNumber(),
            scoreType: faker.random.words(2),
            carClassId: fakeBigNumber(),
            carClass: faker.random.words(2),
          };
        });
    }

    return makeFakeLeaderboards(20);
  }
}
