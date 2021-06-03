import { environment } from '@environments/environment';
import { toDateTime } from '@helpers/luxon';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { BackgroundJob, BackgroundJobStatus } from '@models/background-job';
import faker from 'faker';

/** Fake API for banning players with background processing. */
export class SteelheadPlayersBanWithBackgroundProcessingFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/steelhead\/players\/ban\/useBackgroundProcessing$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): BackgroundJob<unknown> {
    return SteelheadPlayersBanWithBackgroundProcessingFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): BackgroundJob<unknown> {
    return {
      createdDateUtc: toDateTime(faker.date.past()),
      jobId: faker.datatype.uuid().toString(),
      status: BackgroundJobStatus.InProgress,
      rawResult: undefined,
      result: undefined,
      isRead: faker.datatype.boolean(),
      reason: '',
      isMarkingRead: faker.datatype.boolean(),
    };
  }
}
