import { HttpHeaders } from '@angular/common/http';
import { ApolloEndpointKey, GameTitleCodeName, SunriseEndpointKey } from '@models/enums';

const endpointKeyParam = 'endpointKey';

export function overrideSunriseEndpointKey(
  endpoint: SunriseEndpointKey,
  existingHeaders?: HttpHeaders,
): HttpHeaders {
  existingHeaders = existingHeaders || new HttpHeaders();
  return existingHeaders.set(endpointKeyParam, `${GameTitleCodeName.FH4}|${endpoint}`);
}

export function overrideApolloEndpointKey(
  endpoint: ApolloEndpointKey,
  existingHeaders?: HttpHeaders,
): HttpHeaders {
  existingHeaders = existingHeaders || new HttpHeaders();
  return existingHeaders.set(endpointKeyParam, `${GameTitleCodeName.FM7}|${endpoint}`);
}
