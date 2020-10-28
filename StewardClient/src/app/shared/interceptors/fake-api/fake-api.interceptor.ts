import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import _ from 'lodash';
import { Observable, of as ObservableOf } from 'rxjs';
import { delay } from 'rxjs/operators';

import { SunrisePlayerGamertagDetailsFakeApi } from './apis/title/sunrise/player/gamertag/details';
import { SunrisePlayerXuidBanHistoryFakeApi } from './apis/title/sunrise/player/xuid/banHistory';
import { SunrisePlayerXuidConsolesFakeApi } from './apis/title/sunrise/player/xuid/consoleDetails';
import { SunrisePlayerXuidCreditUpdatesFakeApi } from './apis/title/sunrise/player/xuid/creditUpdates';
import { SunrisePlayerXuidProfileSummaryFakeApi } from './apis/title/sunrise/player/xuid/profileSummary';
import { SunrisePlayerXuidConsoleSharedConsoleUsersFakeApi } from './apis/title/sunrise/player/xuid/sharedConsoleUsers';
import { SunrisePlayerXuidUserFlagsFakeApi } from './apis/title/sunrise/player/xuid/userFlags';

/** The list of Fake APIs to query, in order. */
const fakeApiConstructors = [
  SunrisePlayerGamertagDetailsFakeApi,
  SunrisePlayerXuidConsoleSharedConsoleUsersFakeApi,
  SunrisePlayerXuidConsolesFakeApi,
  SunrisePlayerXuidCreditUpdatesFakeApi,
  SunrisePlayerXuidUserFlagsFakeApi,
  SunrisePlayerXuidProfileSummaryFakeApi,
  SunrisePlayerXuidBanHistoryFakeApi,
]

/** Intercepts every request and returns a sample response if it matches the conditions. */
@Injectable()
export class FakeApiInterceptor implements HttpInterceptor {
  // TODO: it should be possible to module-ize this and only load it when on local

  /** Interception hook. */
  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    for (const fakeApiConstructor of fakeApiConstructors) {
      const fakeApi = new fakeApiConstructor(request);
      if (fakeApi.canHandle) {
        return ObservableOf(new HttpResponse({
          body: fakeApi.handle(),
        })).pipe(delay(_.random(1500)+500));
      }
    }

    return next.handle(request);
  }
}
