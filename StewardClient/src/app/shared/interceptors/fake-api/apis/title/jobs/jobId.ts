import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { BackgroundJob, BackgroundJobStatus } from '@models/background-job';
import faker from 'faker';

/** Fake API for getting master inventory. */
export class JobsGetJobFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/jobs\/jobId$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): BackgroundJob<unknown> {
    return JobsGetJobFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): BackgroundJob<unknown> {
    return {
      createdDateUtc: faker.date.past(),
      jobId: faker.datatype.uuid(),
      status: BackgroundJobStatus.InProgress,
      rawResult: {
        key: 'value',
      },
      result: undefined,
      isMarkingRead: undefined,
      isRead: false,
      reason: faker.lorem.sentence(),
    };
  }
}
