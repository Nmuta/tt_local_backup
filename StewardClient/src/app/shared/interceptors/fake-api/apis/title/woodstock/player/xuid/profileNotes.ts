import { environment } from '@environments/environment';
import { toDateTime } from '@helpers/luxon';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { ProfileNote } from '@models/profile-note.model';
import * as faker from 'faker';

/** Fake API for finding User Flags. */
export class WoodstockPlayerXuidProfileNotesApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/woodstock\/player\/xuid\((\d+)\)\/profileNotes$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): ProfileNote[] {
    return WoodstockPlayerXuidProfileNotesApi.makeMany();
  }

  /** Create many example models. */
  public static makeMany(): ProfileNote[] {
    return new Array(faker.datatype.number({ min: 1, max: 5 })).fill(undefined).map(
      () =>
        <ProfileNote>{
          dateUtc: toDateTime(faker.date.past()),
          author: 'System',
          text: faker.random.words(10),
        },
    );
  }
}
