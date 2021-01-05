import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { ApolloGiftHistory } from '@models/apollo';
import { Unprocessed } from '@models/unprocessed';

/** Fake API for finding gift history. */
export class ApolloPlayerXuidGiftHistoryFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /\/?api\/v1\/title\/apollo\/player\/xuid\((.+)\)\/giftHistory/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): Partial<Unprocessed<ApolloGiftHistory>> {
    return ApolloPlayerXuidGiftHistoryFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): Partial<Unprocessed<ApolloGiftHistory>> {
    return {
      playerId: '189456456',
      title: 'Apollo',
      giftSendDateUtc: '2020-12-08T20:04:05.391Z',
      giftInventory: {
        xuid: 189456456,
      },
    };
  }
}
