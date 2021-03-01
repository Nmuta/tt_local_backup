import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { BackgroundJob, BackgroundJobStatus } from '@models/background-job';
import { Unprocessed } from '@models/unprocessed';
import faker from 'faker';

/** Fake API for banning players with background processing. */
export class SunrisePlayersBanWithBackgroundProcessingFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/sunrise\/players\/ban\?useBackgroundProcessing=true$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): Partial<Unprocessed<BackgroundJob<void>>> {
    return SunrisePlayersBanWithBackgroundProcessingFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): Partial<Unprocessed<BackgroundJob<void>>> {
    return {
      jobId: faker.random.uuid().toString(),
      status: BackgroundJobStatus.InProgress,
      result: '',
    };
  }
}
