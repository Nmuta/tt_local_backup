import { Injectable, Provider } from '@angular/core';
import { ApolloGiftingLspGroupFakeApi } from '@interceptors/fake-api/apis/title/apollo/gifting/groupId';
import { ApolloGiftingPlayersFakeApi } from '@interceptors/fake-api/apis/title/apollo/gifting/players';
import { ApolloPlayerXuidInventoryFakeApi } from '@interceptors/fake-api/apis/title/apollo/player/xuid/inventory';
import { ApolloPlayersBanFakeApi } from '@interceptors/fake-api/apis/title/apollo/players/ban';
import { ApolloPlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/apollo/players/identities';
import { IdentityQueryAlpha, IdentityQueryAlphaBatch } from '@models/identity-query.model';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { ApolloService } from './apollo.service';

/** Defines the mock for the API Service. */
@Injectable()
export class MockApolloService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$ = of();

  public getIdentity = jasmine
    .createSpy('getIdentity')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of({ xuid: BigInt(12345), gamertag: 'gamertag' }))),
    );

  public getPlayerDetailsByGamertag = jasmine
    .createSpy('getPlayerDetailsByGamertag')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of({ xuid: BigInt(12345) }))));

  public postBanPlayers = jasmine
    .createSpy('postBanPlayers')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(ApolloPlayersBanFakeApi.make()))));
  public getPlayerIdentity = jasmine
    .createSpy('getPlayerIdentity')
    .and.callFake((query: IdentityQueryAlpha) =>
      this.waitUntil$.pipe(switchMap(() => of(ApolloPlayersIdentitiesFakeApi.make([query])))),
    );
  public getPlayerIdentities = jasmine
    .createSpy('getPlayerIdentities')
    .and.callFake((query: IdentityQueryAlphaBatch) =>
      this.waitUntil$.pipe(switchMap(() => of(ApolloPlayersIdentitiesFakeApi.make(query)))),
    );

  public getMasterInventory = jasmine
    .createSpy('getMasterInventory')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of({}))));

  public postGiftPlayers = jasmine
    .createSpy('postGiftPlayers')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(ApolloGiftingPlayersFakeApi.make()))),
    );

  public postGiftPlayersUsingBackgroundTask = jasmine
    .createSpy('postGiftPlayersUsingBackgroundTask')
    .and.returnValue(of('fake-job-id'));

  public postGiftLspGroup = jasmine
    .createSpy('postGiftLspGroup')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(ApolloGiftingLspGroupFakeApi.make()))),
    );

  public getPlayerInventoryByXuid = jasmine
    .createSpy('getPlayerInventoryByXuid')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(ApolloPlayerXuidInventoryFakeApi.make()))),
    );
}
/** Creates an injectable mock for Apollo Service. */
export function createMockApolloService(): Provider {
  return {
    provide: ApolloService,
    useValue: new MockApolloService(),
  };
}
