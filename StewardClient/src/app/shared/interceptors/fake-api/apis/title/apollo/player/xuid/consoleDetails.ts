import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { ApolloConsoleDetailsEntry } from '@models/apollo';
import { Unprocessed } from '@models/unprocessed';
import * as faker from 'faker';

/** Fake API for finding User Flags. */
export class ApolloPlayerXuidConsolesFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/apollo\/player\/xuid\((\d+)\)\/consoleDetails$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): Unprocessed<ApolloConsoleDetailsEntry[]> {
    return ApolloPlayerXuidConsolesFakeApi.makeMany();
  }

  /** Create many example models. */
  public static makeMany(): Unprocessed<ApolloConsoleDetailsEntry[]> {
    return [
      {
        clientVersion: faker.random.number({ min: 432815, max: 500000 }).toString(),
        consoleId: (
          BigInt(Number.MAX_SAFE_INTEGER) + BigInt(faker.random.number(Number.MAX_SAFE_INTEGER))
        ).toString(),
        isBanned: false,
        isBannable: true,
        deviceType: 'WindowsOneCore',
      },
      {
        clientVersion: faker.random.number({ min: 432815, max: 500000 }).toString(),
        consoleId: (
          BigInt(Number.MAX_SAFE_INTEGER) + BigInt(faker.random.number(Number.MAX_SAFE_INTEGER))
        ).toString(),
        isBanned: true,
        isBannable: true,
        deviceType: 'WindowsOneCore',
      },
      {
        clientVersion: faker.random.number({ min: 432815, max: 500000 }).toString(),
        consoleId: (
          BigInt(Number.MAX_SAFE_INTEGER) + BigInt(faker.random.number(Number.MAX_SAFE_INTEGER))
        ).toString(),
        isBanned: false,
        isBannable: false,
        deviceType: 'WindowsOneCore',
      },
      {
        clientVersion: faker.random.number({ min: 432815, max: 500000 }).toString(),
        consoleId: (
          BigInt(Number.MAX_SAFE_INTEGER) + BigInt(faker.random.number(Number.MAX_SAFE_INTEGER))
        ).toString(),
        isBanned: true,
        isBannable: false,
        deviceType: 'WindowsOneCore',
      },
    ];
  }
}
