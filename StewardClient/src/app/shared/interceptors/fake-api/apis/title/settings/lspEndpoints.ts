import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { LspEndpoints } from '@models/lsp-endpoints';
import faker from '@faker-js/faker';

/** Fake API for getting master inventory. */
export class SettingsGetEndpointsFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/settings\/lspEndpoints$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): LspEndpoints {
    return SettingsGetEndpointsFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): LspEndpoints {
    return {
      apollo: [{ name: faker.random.word() }, { name: faker.random.word() }],
      sunrise: [{ name: faker.random.word() }, { name: faker.random.word() }],
      woodstock: [{ name: faker.random.word() }],
      steelhead: [{ name: faker.random.word() }],
      forte: [{ name: faker.random.word() }],
      forum: [{ name: faker.random.word() }],
    };
  }
}
