import BigNumber from 'bignumber.js';
import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { LspGroups } from '@models/lsp-group';
import { Unprocessed } from '@models/unprocessed';

/** Fake API for finding apollo groups. */
export class ApolloGroupsFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/apollo\/groups$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): Partial<Unprocessed<LspGroups>> {
    return ApolloGroupsFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): Partial<Unprocessed<LspGroups>> {
    return [
      { id: new BigNumber(0), name: 'Fake Lsp Group 1' },
      { id: new BigNumber(1), name: 'Fake Lsp Group 2' },
    ];
  }
}
