import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Store } from '@ngxs/store';
import { AppState } from '@shared/state/app-state';
import _ from 'lodash';
import { Observable, of as ObservableOf, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import { ApolloPlayerGamertagDetailsFakeApi } from './apis/title/apollo/player/gamertag/details';
import { ApolloPlayerProfileIdInventoryFakeApi } from './apis/title/apollo/player/profileId/inventory';
import { ApolloPlayerXuidInventoryFakeApi } from './apis/title/apollo/player/xuid/inventory';
import { ApolloPlayerXuidInventoryProfilesFakeApi } from './apis/title/apollo/player/xuid/inventoryProfiles';
import { ApolloPlayerXuidGiftHistoryFakeApi } from './apis/title/apollo/player/xuid/giftHistory';
import { ApolloPlayersBanFakeApi } from './apis/title/apollo/players/ban';
import { ApolloGroupGamertagsInventoryFakeApi } from './apis/title/apollo/group/gamertags/inventory';
import { ApolloGroupGroupIdInventoryFakeApi } from './apis/title/apollo/group/groupId/inventory';
import { ApolloGroupXuidsInventoryFakeApi } from './apis/title/apollo/group/xuids/inventory';
import { ApolloGroupGroupIdGiftHistoryFakeApi } from './apis/title/apollo/group/groupId/giftHistory';

import { GravityPlayerGamertagDetailsFakeApi } from './apis/title/gravity/player/gamertag/details';
import { GravityPlayerXuidInventoryFakeApi } from './apis/title/gravity/player/xuid/inventory';
import { GravityPlayerXuidProfileIdInventoryFakeApi } from './apis/title/gravity/player/xuid/profileId/inventory';
import { GravityPlayerT10IdInventoryFakeApi } from './apis/title/gravity/player/t10Id/inventory';
import { GravityPlayerT10IdProfileIdInventoryFakeApi } from './apis/title/gravity/player/t10Id/profileId/inventory';
import { GravityPlayerT10IdGiftHistoryFakeApi } from './apis/title/gravity/player/t10Id/giftHistory'

import { OpusPlayerGamertagDetailsFakeApi } from './apis/title/opus/player/gamertag/details';
import { OpusPlayerProfileIdInventoryFakeApi } from './apis/title/opus/player/profileId/inventory';
import { OpusPlayerXuidInventoryFakeApi } from './apis/title/opus/player/xuid/inventory';
import { OpusPlayerXuidInventoryProfilesFakeApi } from './apis/title/opus/player/xuid/inventoryProfiles';

import { SunriseConsoleIsBannedFakeApi } from './apis/title/sunrise/console/isBanned';
import { SunrisePlayerGamertagDetailsFakeApi } from './apis/title/sunrise/player/gamertag/details';
import { SunrisePlayerXuidBanHistoryFakeApi } from './apis/title/sunrise/player/xuid/banHistory';
import { SunrisePlayerXuidConsolesFakeApi } from './apis/title/sunrise/player/xuid/consoleDetails';
import { SunrisePlayerXuidCreditUpdatesFakeApi } from './apis/title/sunrise/player/xuid/creditUpdates';
import { SunrisePlayerXuidProfileSummaryFakeApi } from './apis/title/sunrise/player/xuid/profileSummary';
import { SunrisePlayerXuidConsoleSharedConsoleUsersFakeApi } from './apis/title/sunrise/player/xuid/sharedConsoleUsers';
import { SunrisePlayerXuidUserFlagsFakeApi } from './apis/title/sunrise/player/xuid/userFlags';
import { SunrisePlayerXuidGiftHistoryFakeApi } from './apis/title/sunrise/player/xuid/giftHistory';
import { SunrisePlayersBanFakeApi } from './apis/title/sunrise/players/ban';
import { SunriseGroupsFakeApi } from './apis/title/sunrise/groups';
import { SunrisePlayerXuidInventoryFakeApi } from './apis/title/sunrise/player/xuid/inventory';
import { SunrisePlayerXuidInventoryProfilesFakeApi } from './apis/title/sunrise/player/xuid/inventoryProfiles';
import { SunrisePlayerProfileIdInventoryFakeApi } from './apis/title/sunrise/player/profileId/inventory';
import { SunriseGroupGamertagsInventoryFakeApi } from './apis/title/sunrise/group/gamertags/inventory';
import { SunriseGroupGroupIdInventoryFakeApi } from './apis/title/sunrise/group/groupId/inventory';
import { SunriseGroupXuidsInventoryFakeApi } from './apis/title/sunrise/group/xuids/inventory';
import { SunriseGroupGroupIdGiftHistoryFakeApi } from './apis/title/sunrise/group/groupId/giftHistory';

/** The list of Fake APIs to query, in order. */
const fakeApiConstructors = [
  // Gravity
  GravityPlayerGamertagDetailsFakeApi,
  GravityPlayerXuidInventoryFakeApi,
  GravityPlayerXuidProfileIdInventoryFakeApi,
  GravityPlayerT10IdInventoryFakeApi,
  GravityPlayerT10IdProfileIdInventoryFakeApi,
  GravityPlayerT10IdInventoryFakeApi,
  GravityPlayerXuidInventoryFakeApi,
  GravityPlayerT10IdGiftHistoryFakeApi,

  // Sunrise
  SunrisePlayerGamertagDetailsFakeApi,
  SunrisePlayerXuidConsoleSharedConsoleUsersFakeApi,
  SunrisePlayerXuidConsolesFakeApi,
  SunrisePlayerXuidCreditUpdatesFakeApi,
  SunrisePlayerXuidUserFlagsFakeApi,
  SunrisePlayerXuidProfileSummaryFakeApi,
  SunrisePlayerXuidBanHistoryFakeApi,
  SunrisePlayerXuidGiftHistoryFakeApi,
  SunriseConsoleIsBannedFakeApi,
  SunriseGroupsFakeApi,
  SunrisePlayerXuidInventoryFakeApi,
  SunrisePlayerXuidInventoryProfilesFakeApi,
  SunrisePlayerProfileIdInventoryFakeApi,
  SunrisePlayersBanFakeApi,
  SunriseGroupGamertagsInventoryFakeApi,
  SunriseGroupGroupIdInventoryFakeApi,
  SunriseGroupXuidsInventoryFakeApi,
  SunriseGroupGroupIdGiftHistoryFakeApi,

  // Apollo
  ApolloPlayerGamertagDetailsFakeApi,
  ApolloPlayerProfileIdInventoryFakeApi,
  ApolloPlayerXuidInventoryFakeApi,
  ApolloPlayerXuidInventoryProfilesFakeApi,
  ApolloPlayerXuidInventoryFakeApi,
  ApolloPlayerXuidGiftHistoryFakeApi,
  ApolloPlayersBanFakeApi,
  ApolloGroupGamertagsInventoryFakeApi,
  ApolloGroupGroupIdInventoryFakeApi,
  ApolloGroupXuidsInventoryFakeApi,
  ApolloGroupGroupIdGiftHistoryFakeApi,
  
  // Opus
  OpusPlayerGamertagDetailsFakeApi,
  OpusPlayerProfileIdInventoryFakeApi,
  OpusPlayerXuidInventoryFakeApi,
  OpusPlayerXuidInventoryProfilesFakeApi,
];

/** The URLs this interceptor will not block. */
const urlAllowList = [`${environment.stewardApiUrl}/api/v1/me`];

/** Intercepts every request and returns a sample response if it matches the conditions. */
@Injectable()
export class FakeApiInterceptor implements HttpInterceptor {
  constructor(private readonly store: Store) {}

  /** Interception hook. */
  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const isEnabled = this.store.selectSnapshot<boolean>(
      (state: AppState) => state.userSettings.enableFakeApi,
    );
    if (!isEnabled) {
      return next.handle(request);
    }

    for (const fakeApiConstructor of fakeApiConstructors) {
      const fakeApi = new fakeApiConstructor(request);
      if (fakeApi.canHandle) {
        return ObservableOf(
          new HttpResponse({
            body: fakeApi.handleString(),
          }),
        ).pipe(delay(_.random(1500) + 500));
      }
    }

    const isAllowed = urlAllowList.includes(request.url);
    if (!isAllowed) {
      return throwError(
        new HttpErrorResponse({
          url: request.url,
          status: 9000,
          statusText: 'URL not on the allowed list of URLs in FakeApiInterceptor.',
        }),
      );
    }

    return next.handle(request);
  }
}
