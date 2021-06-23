import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import * as faker from 'faker';
import { PlayerAuction } from '@models/player-auction';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import BigNumber from 'bignumber.js';
import { AuctionStatus } from '@models/auction-filters';
import { sample } from 'lodash';

/** Fake API for finding player auctions. */
export class SunrisePlayerXuidAuctionsFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/sunrise\/player\/xuid\((\d+)\)\/auctions$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): PlayerAuction[] {
    return SunrisePlayerXuidAuctionsFakeApi.makeMany();
  }

  /** Create many example models. */
  public static makeMany(): PlayerAuction[] {
    return new Array(faker.datatype.number({ min: 10, max: 25 })).fill(undefined).map(() => {
      const currentPrice: BigNumber = fakeBigNumber({
        min: 10_000,
        max: 500_000,
      });
      return {
        id: faker.datatype.uuid(),
        itemName: faker.random.words(3),
        makeId: fakeBigNumber(),
        modelId: fakeBigNumber(),
        status: sample(Object.values(AuctionStatus)),
        currentPrice: currentPrice,
        buyoutPrice: currentPrice.plus(
          fakeBigNumber({
            min: 10_000,
            max: 500_000,
          }),
        ),
        bids: new BigNumber(faker.random.number(5)),
        createdDateUtc: faker.date.past(),
        closingDateUtc: faker.date.future(),
        liveryImageBase64: faker.image.imageUrl(800, 600, 'any', true),
        textureMapImageBase64: faker.image.imageUrl(800, 600, 'any', true),
        reviewState: fakeBigNumber(),
        totalReports: new BigNumber(faker.random.number(5)),
      } as PlayerAuction;
    });
  }
}
