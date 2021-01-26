import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { GameTitleCodeName } from '@models/enums';
import { SunriseBanArea } from '@models/sunrise';
import { LiveOpsBanDescription, LiveOpsBanDescriptions } from '@models/sunrise/sunrise-ban-history.model';
import { Unprocessed } from '@models/unprocessed';
import faker from 'faker';

/** Fake API for finding User Flags. */
export class SunrisePlayerXuidBanHistoryFakeApi extends FakeApiBase {
  private xuid: BigInt;

  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/sunrise\/player\/xuid\((\d+)\)\/banHistory$/i;
    const isMatch = regex.test(url.pathname);
    if (!isMatch) { return false; }

    const match = url.pathname.match(regex);
    this.xuid = BigInt(match[1]);
    return true;
  }

  /** Produces a sample API response. */
  public handle(): Unprocessed<LiveOpsBanDescriptions> {
    return SunrisePlayerXuidBanHistoryFakeApi.make(this.xuid);
  }

  /** Creates a sample object. */
  public static make(xuid: BigInt): Unprocessed<LiveOpsBanDescriptions> {
    return new Array(faker.random.number({min: 0, max: 5}))
      .fill(undefined)
      .map(() =>
        <LiveOpsBanDescription> {
          banParameters: faker.lorem.paragraph(),
          expireTimeUtc: faker.date.future(),
          startTimeUtc: faker.date.past(),
          featureArea: faker.random.arrayElement(Object.values(SunriseBanArea)),
          isActive: faker.random.boolean(),
          reason: faker.lorem.sentence(),
          requestingAgent: faker.internet.email(),
          title: faker.random.arrayElement(Object.values(GameTitleCodeName)),
          xuid: xuid,
        });
  }
}
