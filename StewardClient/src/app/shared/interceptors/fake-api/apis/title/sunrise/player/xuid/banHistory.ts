import BigNumber from 'bignumber.js';
import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { GameTitleCodeName } from '@models/enums';
import { SunriseBanArea } from '@models/sunrise';
import { LiveOpsBanDescription, LiveOpsBanDescriptions } from '@models/sunrise';
import faker from 'faker';
import { toDateTime } from '@helpers/luxon';

/** Fake API for finding User Flags. */
export class SunrisePlayerXuidBanHistoryFakeApi extends FakeApiBase {
  private xuid: BigNumber;

  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/sunrise\/player\/xuid\((\d+)\)\/banHistory$/i;
    const isMatch = regex.test(url.pathname);
    if (!isMatch) {
      return false;
    }

    const match = url.pathname.match(regex);
    this.xuid = new BigNumber(match[1]);
    return true;
  }

  /** Produces a sample API response. */
  public handle(): LiveOpsBanDescriptions {
    return SunrisePlayerXuidBanHistoryFakeApi.make(this.xuid);
  }

  /** Creates a sample object. */
  public static make(xuid: BigNumber, min: number = 0): LiveOpsBanDescriptions {
    return new Array(faker.datatype.number({ min: min, max: 5 })).fill(undefined).map(
      () =>
        <LiveOpsBanDescription>{
          banParameters: faker.lorem.paragraph(),
          expireTimeUtc: toDateTime(faker.date.future()),
          startTimeUtc: toDateTime(faker.date.past()),
          featureArea: faker.random.arrayElement(Object.values(SunriseBanArea)),
          isActive: faker.datatype.boolean(),
          reason: faker.lorem.sentence(),
          requesterObjectId: faker.datatype.uuid(),
          title: faker.random.arrayElement(Object.values(GameTitleCodeName)),
          xuid: xuid,
        },
    );
  }
}
