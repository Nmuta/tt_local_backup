import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { fakeBigInt } from '@interceptors/fake-api/utility';
import { ApolloPlayerInventory } from '@models/apollo';
import { ApolloCar, ApolloInventoryItem } from '@models/apollo/inventory-items';
import faker from 'faker';

/** Fake API for apollo player inventory. */
export class ApolloPlayerXuidInventoryFakeApi extends FakeApiBase {
  private xuid: BigInt;

  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/apollo\/player\/xuid\((.+)\)\/inventory$/i;
    const isMatch = regex.test(url.pathname);
    if (!isMatch) {
      return false;
    }

    const match = url.pathname.match(regex);
    this.xuid = BigInt(match[1]);
    return true;
  }

  /** Produces a sample API response. */
  public handle(): ApolloPlayerInventory {
    return ApolloPlayerXuidInventoryFakeApi.make(this.xuid);
  }

  /** Generates a sample object */
  public static make(xuid: BigInt): ApolloPlayerInventory {
    function makeFakeItems(count: number): ApolloInventoryItem[] {
      return Array(faker.random.number(count))
        .fill(0)
        .map(() => {
          return {
            itemId: fakeBigInt(),
            quantity: fakeBigInt({ min: 1, max: 20 }),
            acquisitionUtc: faker.date.past(),
            lastUsedUtc: faker.date.recent(),
            description: faker.lorem.sentences(2),
            special: faker.random.arrayElement(['Unicorn', '']),
          };
        });
    }

    function makeFakeCars(count: number): ApolloCar[] {
      return makeFakeItems(count).map(i => {
        return {
          ...i,
          vin: faker.random.uuid(),
          baseCost: fakeBigInt({ min: 4_000 }),
          collectorScore: fakeBigInt({ min: 4_000, max: 200_000 }),
          isOnlineOnly: faker.random.boolean(),
          productionNumber: fakeBigInt({ min: 4_000, max: 200_000 }),
          purchaseUtc: faker.date.past(),
          versionedLiveryId: faker.random.uuid(),
          versionedTuneId: faker.random.uuid(),
        };
      });
    }

    return {
      xuid: xuid,
      giftReason: faker.lorem.paragraph(),
      credits: fakeBigInt({ min: 0 }),
      cars: makeFakeCars(200),
      mods: makeFakeItems(200),
      vanityItems: makeFakeItems(200),
      packs: makeFakeItems(200),
      badges: makeFakeItems(200),
    };
  }
}
