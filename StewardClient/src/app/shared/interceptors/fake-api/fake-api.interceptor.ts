import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of as ObservableOf } from 'rxjs';

import { PlayerGamertagFakeApi } from './apis/player-gamertag';
import { PlayerXuidConsoleSharedUsersFakeApi } from './apis/player-xuid-console-sharedUsers';
import { PlayerXuidConsolesFakeApi } from './apis/player-xuid-consoles';
import { PlayerXuidCreditUpdatesFakeApi } from './apis/player-xuid-creditUpdates';
import { PlayerXuidFlagsFakeApi } from './apis/player-xuid-flags';
import { PlayerXuidProfileSummaryFakeApi } from './apis/player-xuid-profileSummary';

/** The list of Fake APIs to query, in order. */
const fakeApiConstructors = [
  PlayerGamertagFakeApi,
  PlayerXuidConsoleSharedUsersFakeApi,
  PlayerXuidConsolesFakeApi,
  PlayerXuidCreditUpdatesFakeApi,
  PlayerXuidFlagsFakeApi,
  PlayerXuidProfileSummaryFakeApi,
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
        }));
      }
    }

    return next.handle(request);
  }
}
