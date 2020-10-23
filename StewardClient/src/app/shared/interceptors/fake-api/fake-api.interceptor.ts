import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, of as ObservableOf } from 'rxjs';
import { FakeUserDetailsApi } from './apis/user-details.fake';

/** The list of Fake APIs to query, in order. */
const fakeApiConstructors = [
  FakeUserDetailsApi,
]

/** Intercepts every request and returns a sample response if it matches the conditions. */
@Injectable()
export class FakeApiInterceptor implements HttpInterceptor {
  // TODO: it should be possible to module-ize this and only load it when on local
  constructor() {}

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
