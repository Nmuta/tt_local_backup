import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of as ObservableOf } from 'rxjs';

import { SunrisePlayerGamertagFakeApi } from './apis/title/sunrise/player/gamertag';
import { SunrisePlayerXuidConsolesFakeApi } from './apis/title/sunrise/player/xuid/console/consoles';
import { SunrisePlayerXuidConsoleSharedUsersFakeApi } from './apis/title/sunrise/player/xuid/console/sharedUsers';
import { SunrisePlayerXuidCreditUpdatesFakeApi } from './apis/title/sunrise/player/xuid/creditUpdates';
import { SunrisePlayerXuidFlagsFakeApi } from './apis/title/sunrise/player/xuid/flags';
import { SunrisePlayerXuidProfileSummaryFakeApi } from './apis/title/sunrise/player/xuid/profileSummary';

/** The list of Fake APIs to query, in order. */
const fakeApiConstructors = [
  SunrisePlayerGamertagFakeApi,
  SunrisePlayerXuidConsoleSharedUsersFakeApi,
  SunrisePlayerXuidConsolesFakeApi,
  SunrisePlayerXuidCreditUpdatesFakeApi,
  SunrisePlayerXuidFlagsFakeApi,
  SunrisePlayerXuidProfileSummaryFakeApi,
]

/** Intercepts every request and returns a sample response if it matches the conditions. */
@Injectable()
export class FakeApiInterceptor implements HttpInterceptor {
  // TODO: it should be possible to module-ize this and only load it when on local

  /** Interception hook. */
  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    for (const fakeApiConstructor of fakeApiConstructors) {
      debugger;
      const fakeApi = new fakeApiConstructor(request);
      if (fakeApi.canHandle) {
        return ObservableOf(new HttpResponse({
          body: fakeApi.handle(),
        }));
      }
    }

    return next.handle(request);
  }
}
