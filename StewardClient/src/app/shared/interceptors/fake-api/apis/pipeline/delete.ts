import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import faker from '@faker-js/faker';

/** Fake API for DELETEing a single pipeline. */
export class PipelineDeleteFakeApi extends FakeApiBase {
  private pipelineName: string = null;

  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    if (this.request.method.toLowerCase() !== 'delete') {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/pipeline\/(.+)$/i;
    const isMatch = regex.test(url.pathname);
    if (!isMatch) {
      return false;
    }

    const match = url.pathname.match(regex);
    this.pipelineName = match[1];
    return true;
  }

  /** Produces a sample API response. */
  public handle(): string {
    return PipelineDeleteFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): string {
    return faker.datatype.uuid();
  }
}
