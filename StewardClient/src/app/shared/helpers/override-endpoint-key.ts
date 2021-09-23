import { HttpHeaders } from '@angular/common/http';
import { GameTitleCodeName } from '@models/enums';

const endpointKeyParam = 'endpointKey';

export function overrideSunriseEndpointKey(
  endpoint: string,
  existingHeaders?: HttpHeaders,
): HttpHeaders {
  existingHeaders = existingHeaders || new HttpHeaders();
  return existingHeaders.set(endpointKeyParam, `${GameTitleCodeName.FH4}|${endpoint}`);
}

export function overrideApolloEndpointKey(
  endpoint: string,
  existingHeaders?: HttpHeaders,
): HttpHeaders {
  existingHeaders = existingHeaders || new HttpHeaders();
  return existingHeaders.set(endpointKeyParam, `${GameTitleCodeName.FM7}|${endpoint}`);
}
