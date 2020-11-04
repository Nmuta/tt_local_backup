import { HttpRequest } from '@angular/common/http';
import { environment } from '@environments/environment';
import {
  FakeApiBase,
  FakeApiBaseV2,
  RequestMethodFilters,
} from '@interceptors/fake-api/apis/fake-api-base';
import { SunriseUserFlags } from '@models/sunrise';
import { SunriseConsoleDetails } from '@models/sunrise/sunrise-console-details.model';
import { Unprocessed } from '@models/unprocessed';

/** Fake API for getting console details. */
export class SunriseFakeApiConsoleDetails extends FakeApiBaseV2<
  SunriseConsoleDetails
> {
  constructor(protected readonly request: HttpRequest<unknown>) {
    super(
      request,
      RequestMethodFilters.GET,
      /\/?api\/v2\/title\/sunrise\/console\/consoleId\((\d+)\)\/isBanned\((true|false)\)/i,
      null
    );
  }
}

/** Fake API for getting User Flags. */
export class SunriseFakeApiUserFlags extends FakeApiBaseV2<SunriseUserFlags> {
  constructor(protected readonly request: HttpRequest<unknown>) {
    super(
      request,
      RequestMethodFilters.GET,
      /\/?api\/v2\/title\/sunrise\/player\/xuid\((\d+)\)\/userFlags/i,
      {
        isVip: false,
        isUltimateVip: false,
        isTurn10Employee: false,
        isCommunityManager: false,
        isUnderReview: false,
        isEarlyAccess: false,
      }
    );
  }
}

// Or single class with an array of FakeApiRequest objects
// that is looped through at interceptor level. You then pass that object,
// into the canHandle() and handle() functions when called.
// This way, we can have a single file per service just as services are setup
