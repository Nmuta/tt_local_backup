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
import { ApolloPlayerProfileIdInventoryFakeApi } from './apis/title/apollo/player/profileId/getInventory';
import { ApolloPlayerXuidInventoryFakeApi } from './apis/title/apollo/player/xuid/getInventory';
import { ApolloPlayerXuidInventoryProfilesFakeApi } from './apis/title/apollo/player/xuid/getInventoryProfiles';
import { POSTApolloPlayerXuidInventoryFakeApi } from './apis/title/apollo/player/xuid/postInventory';
import { POSTApolloGroupGamertagsInventoryFakeApi } from './apis/title/apollo/group/gamertags/postInventory';
import { POSTApolloGroupGroupIdInventoryFakeApi } from './apis/title/apollo/group/groupId/postInventory';
import { POSTApolloGroupXuidsInventoryFakeApi } from './apis/title/apollo/group/xuids/postInventory';

import { GravityPlayerGamertagDetailsFakeApi } from './apis/title/gravity/player/gamertag/details';
import { GravityPlayerXuidInventoryFakeApi } from './apis/title/gravity/player/xuid/getInventory';
import { GravityPlayerXuidProfileIdInventoryFakeApi } from './apis/title/gravity/player/xuid/profileId/getInventory';
import { GravityPlayerT10IdInventoryFakeApi } from './apis/title/gravity/player/t10Id/getInventory';
import { GravityPlayerT10IdProfileIdInventoryFakeApi } from './apis/title/gravity/player/t10Id/profileId/getInventory';
import { POSTGravityPlayerT10IdInventoryFakeApi } from './apis/title/gravity/player/t10Id/postInventory';
import { POSTGravityPlayerXuidInventoryFakeApi } from './apis/title/gravity/player/xuid/postInventory';

import { OpusPlayerGamertagDetailsFakeApi } from './apis/title/opus/player/gamertag/details';
import { OpusPlayerProfileIdInventoryFakeApi } from './apis/title/opus/player/profileId/getInventory';
import { OpusPlayerXuidInventoryFakeApi } from './apis/title/opus/player/xuid/getInventory';
import { OpusPlayerXuidInventoryProfilesFakeApi } from './apis/title/opus/player/xuid/getInventoryProfiles';

import { SunriseConsoleIsBannedFakeApi } from './apis/title/sunrise/console/isBanned';
import { SunrisePlayerGamertagDetailsFakeApi } from './apis/title/sunrise/player/gamertag/details';
import { SunrisePlayerXuidBanHistoryFakeApi } from './apis/title/sunrise/player/xuid/banHistory';
import { SunrisePlayerXuidConsolesFakeApi } from './apis/title/sunrise/player/xuid/consoleDetails';
import { SunrisePlayerXuidCreditUpdatesFakeApi } from './apis/title/sunrise/player/xuid/creditUpdates';
import { SunrisePlayerXuidProfileSummaryFakeApi } from './apis/title/sunrise/player/xuid/profileSummary';
import { SunrisePlayerXuidConsoleSharedConsoleUsersFakeApi } from './apis/title/sunrise/player/xuid/sharedConsoleUsers';
import { SunrisePlayerXuidUserFlagsFakeApi } from './apis/title/sunrise/player/xuid/userFlags';
import { SunriseGroupsFakeApi } from './apis/title/sunrise/getGroups';
import { SunrisePlayerXuidInventoryFakeApi } from './apis/title/sunrise/player/xuid/getInventory';
import { SunrisePlayerXuidInventoryProfilesFakeApi } from './apis/title/sunrise/player/xuid/getInventoryProfiles';
import { SunrisePlayerProfileIdInventoryFakeApi } from './apis/title/sunrise/player/profileId/getInventory';
import { POSTSunrisePlayerXuidInventoryFakeApi } from './apis/title/sunrise/player/xuid/postInventory';
import { POSTSunriseGroupGamertagsInventoryFakeApi } from './apis/title/sunrise/group/gamertags/postInventory';
import { POSTSunriseGroupGroupIdInventoryFakeApi } from './apis/title/sunrise/group/groupId/postInventory';
import { POSTSunriseGroupXuidsInventoryFakeApi } from './apis/title/sunrise/group/xuids/postInventory';

/** The list of Fake APIs to query, in order. */
const fakeApiConstructors = [
  // Gravity
  GravityPlayerGamertagDetailsFakeApi,
  GravityPlayerXuidInventoryFakeApi,
  GravityPlayerXuidProfileIdInventoryFakeApi,
  GravityPlayerT10IdInventoryFakeApi,
  GravityPlayerT10IdProfileIdInventoryFakeApi,
  POSTGravityPlayerT10IdInventoryFakeApi,
  POSTGravityPlayerXuidInventoryFakeApi,
  // Sunrise
  SunrisePlayerGamertagDetailsFakeApi,
  SunrisePlayerXuidConsoleSharedConsoleUsersFakeApi,
  SunrisePlayerXuidConsolesFakeApi,
  SunrisePlayerXuidCreditUpdatesFakeApi,
  SunrisePlayerXuidUserFlagsFakeApi,
  SunrisePlayerXuidProfileSummaryFakeApi,
  SunrisePlayerXuidBanHistoryFakeApi,
  SunriseConsoleIsBannedFakeApi,
  SunriseGroupsFakeApi,
  SunrisePlayerXuidInventoryFakeApi,
  SunrisePlayerXuidInventoryProfilesFakeApi,
  SunrisePlayerProfileIdInventoryFakeApi,
  POSTSunrisePlayerXuidInventoryFakeApi,
  POSTSunriseGroupGamertagsInventoryFakeApi,
  POSTSunriseGroupGroupIdInventoryFakeApi,
  POSTSunriseGroupXuidsInventoryFakeApi,
  // Apollo
  ApolloPlayerGamertagDetailsFakeApi,
  ApolloPlayerProfileIdInventoryFakeApi,
  ApolloPlayerXuidInventoryFakeApi,
  ApolloPlayerXuidInventoryProfilesFakeApi,
  POSTApolloPlayerXuidInventoryFakeApi,
  POSTApolloGroupGamertagsInventoryFakeApi,
  POSTApolloGroupGroupIdInventoryFakeApi,
  POSTApolloGroupXuidsInventoryFakeApi,
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
