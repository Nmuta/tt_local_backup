import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { GravityPlayerInventoryBeta } from '@models/gravity';
import { Unprocessed } from '@models/unprocessed';
import { GravityPlayerT10IdInventoryFakeApi } from '../inventory';

/** Fake API for gravity player inventory. */
export class GravityPlayerT10IdProfileIdInventoryFakeApi extends FakeApiBase {
  private t10Id: string;
  private profileId: string;

  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/gravity\/player\/t10Id\((.+)\)\/profileId\((.+)\)\/inventory$/i;
    const isMatch = regex.test(url.pathname);
    if (!isMatch) {
      return false;
    }

    const match = url.pathname.match(regex);
    this.t10Id = match[1];
    this.profileId = match[2];
    return true;
  }

  /** Produces a sample API response. */
  public handle(): Partial<Unprocessed<GravityPlayerInventoryBeta>> {
    return GravityPlayerT10IdProfileIdInventoryFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): Partial<Unprocessed<GravityPlayerInventoryBeta>> {
    return GravityPlayerT10IdInventoryFakeApi.make(null);
  }
}
