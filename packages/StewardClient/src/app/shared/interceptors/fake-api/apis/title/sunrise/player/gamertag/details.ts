import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { SunrisePlayerDetails } from '@models/sunrise';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import faker from '@faker-js/faker';

/** Fake API for finding User Flags. */
export class SunrisePlayerGamertagDetailsFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/sunrise\/player\/gamertag\((.+)\)\/details$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): SunrisePlayerDetails {
    return SunrisePlayerGamertagDetailsFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): SunrisePlayerDetails {
    return {
      xuid: fakeBigNumber(),
      gamertag: 'sunrise-gamertag',
      licensePlate: 'HORIZON',
      region: fakeBigNumber(),
      currentCareerLevel: fakeBigNumber(),
      blueprintThreadLevel: fakeBigNumber(),
      clubId: faker.datatype.uuid(),
      clubTag: faker.datatype.uuid(),
      currentDriverModelId: fakeBigNumber(),
      currentPlayerBadgeId: fakeBigNumber(),
      currentPlayerTitleId: fakeBigNumber(),
      customizationSlots: new Array(faker.datatype.number())
        .fill(undefined)
        .map(_ => fakeBigNumber()),
      flags: fakeBigNumber(),
      painterThreadLevel: fakeBigNumber(),
      photoThreadLevel: fakeBigNumber(),
      roleInClub: faker.datatype.uuid(),
      roleInTeam: faker.datatype.uuid(),
      teamId: faker.datatype.uuid(),
      teamTag: faker.datatype.uuid(),
      tunerThreadLevel: fakeBigNumber(),
    };
  }
}
