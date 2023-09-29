import { environment } from '@environments/environment';
import faker from '@faker-js/faker';
import { toDateTime } from '@helpers/luxon';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { BackgroundJob, BackgroundJobStatus } from '@models/background-job';

/** Fake API for gifting to players. */
export class SunriseGiftingPlayersReturnsBackgroundJobFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/sunrise\/gifting\/players\/useBackgroundProcessing$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): BackgroundJob<void> {
    return SunriseGiftingPlayersReturnsBackgroundJobFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): BackgroundJob<void> {
    return {
      createdDateUtc: toDateTime(faker.date.past()),
      userId: faker.datatype.uuid(),
      jobId: faker.datatype.uuid(),
      status: BackgroundJobStatus.InProgress,
      rawResult: {
        key: 'value',
      },
      result: undefined,
      isMarkingRead: undefined,
      isRead: false,
      isTestJob: false,
      reason: faker.lorem.sentence(),
    };
  }
}
