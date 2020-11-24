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
import { AppSettings } from '@shared/state/app-settings';
import { UserSettingsStateModel } from '@shared/state/user-settings/user-settings.state';
import _ from 'lodash';
import { Observable, of as ObservableOf, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import { ApolloPlayerGamertagDetailsFakeApi } from './apis/title/apollo/player/gamertag/details';
import { GravityPlayerGamertagDetailsFakeApi } from './apis/title/gravity/player/gamertag/details';
import { OpusPlayerGamertagDetailsFakeApi } from './apis/title/opus/player/gamertag/details';
import { SunriseConsoleIsBannedFakeApi } from './apis/title/sunrise/console/isBanned';
import { SunrisePlayerGamertagDetailsFakeApi } from './apis/title/sunrise/player/gamertag/details';
import { SunrisePlayerXuidBanHistoryFakeApi } from './apis/title/sunrise/player/xuid/banHistory';
import { SunrisePlayerXuidConsolesFakeApi } from './apis/title/sunrise/player/xuid/consoleDetails';
import { SunrisePlayerXuidCreditUpdatesFakeApi } from './apis/title/sunrise/player/xuid/creditUpdates';
import { SunrisePlayerXuidProfileSummaryFakeApi } from './apis/title/sunrise/player/xuid/profileSummary';
import { SunrisePlayerXuidConsoleSharedConsoleUsersFakeApi } from './apis/title/sunrise/player/xuid/sharedConsoleUsers';
import { SunrisePlayerXuidUserFlagsFakeApi } from './apis/title/sunrise/player/xuid/userFlags';

/** The list of Fake APIs to query, in order. */
const fakeApiConstructors = [
  // Gravity
  GravityPlayerGamertagDetailsFakeApi,
  // Sunrise
  SunrisePlayerGamertagDetailsFakeApi,
  SunrisePlayerXuidConsoleSharedConsoleUsersFakeApi,
  SunrisePlayerXuidConsolesFakeApi,
  SunrisePlayerXuidCreditUpdatesFakeApi,
  SunrisePlayerXuidUserFlagsFakeApi,
  SunrisePlayerXuidProfileSummaryFakeApi,
  SunrisePlayerXuidBanHistoryFakeApi,
  SunriseConsoleIsBannedFakeApi,
  // Apollo
  ApolloPlayerGamertagDetailsFakeApi,
  // Opus
  OpusPlayerGamertagDetailsFakeApi,
];

/** The URLs this interceptor will not block. */
const urlAllowList = [`${environment.stewardApiUrl}/api/me`];

/** Intercepts every request and returns a sample response if it matches the conditions. */
@Injectable()
export class FakeApiInterceptor implements HttpInterceptor {
  constructor(private readonly store: Store) { }

  /** Interception hook. */
  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const isEnabled = this.store.selectSnapshot<boolean>((state: AppSettings) => state.userSettings.enableFakeApi);
    if (!isEnabled) { return next.handle(request); }

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
