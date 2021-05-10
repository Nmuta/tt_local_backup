import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { WoodstockPlayerDetails } from '@models/woodstock';
import { fakeBigNumber, faker } from '@interceptors/fake-api/utility';

/** Fake API for finding User Flags. */
export class WoodstockPlayerGamertagDetailsFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/woodstock\/player\/gamertag\((.+)\)\/details$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): WoodstockPlayerDetails {
    return WoodstockPlayerGamertagDetailsFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): WoodstockPlayerDetails {
    return {
      xuid: fakeBigNumber(),
      gamertag: 'woodstock-gamertag',
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
