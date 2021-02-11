import { Injectable, Provider } from '@angular/core';
import { OpusPlayerXuidInventoryFakeApi } from '@interceptors/fake-api/apis/title/opus/player/xuid/inventory';
import { OpusPlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/opus/players/identities';
import { IdentityQueryAlpha, IdentityQueryAlphaBatch } from '@models/identity-query.model';
import { defer, of } from 'rxjs';

import { OpusService } from './opus.service';

/** Defines the mock for the API Service. */
@Injectable()
export class MockOpusService {
  public getIdentity = jasmine
    .createSpy('getIdentity')
    .and.returnValue(of({ xuid: BigInt(12345), gamertag: 'gamertag' }));

  public getPlayerDetailsByGamertag = jasmine
    .createSpy('getPlayerDetailsByGamertag')
    .and.returnValue(of({}));

  public getPlayerIdentity = jasmine
    .createSpy('getPlayerIdentity')
    .and.callFake((query: IdentityQueryAlpha) =>
      defer(() => of(OpusPlayersIdentitiesFakeApi.make([query]))),
    );
  public getPlayerIdentities = jasmine
    .createSpy('getPlayerIdentities')
    .and.callFake((query: IdentityQueryAlphaBatch) =>
      defer(() => of(OpusPlayersIdentitiesFakeApi.make(query))),
    );

  public getPlayerInventoryByXuid = jasmine
    .createSpy('getPlayerInventoryByXuid')
    .and.callFake(_ => defer(() => of(OpusPlayerXuidInventoryFakeApi.make())));
}

/** Creates an injectable mock for Opus Service. */
export function createMockOpusService(): Provider {
  return {
    provide: OpusService,
    useValue: new MockOpusService(),
  };
}
