import { HttpHeaders } from '@angular/common/http';
import { GameTitleCodeName } from '@models/enums';

const endpointKeyParam = 'endpointKey';
const v2WoostockEndpointKeyParam = 'endpoint-woodstock';
const v2SunriseEndpointKeyParam = 'endpoint-sunrise';
const v2ApolloEndpointKeyParam = 'endpoint-apollo';
const v2SteelheadEndpointKeyParam = 'endpoint-steelhead';

export function overrideSunriseEndpointKey(
  endpoint: string,
  existingHeaders: HttpHeaders = new HttpHeaders(),
): HttpHeaders {
  if (!endpoint) {
    return existingHeaders;
  }
  existingHeaders = existingHeaders
    .set(endpointKeyParam, `${GameTitleCodeName.FH4}|${endpoint}`)
    .set(v2SunriseEndpointKeyParam, endpoint);
  return existingHeaders;
}

export function overrideApolloEndpointKey(
  endpoint: string,
  existingHeaders: HttpHeaders = new HttpHeaders(),
): HttpHeaders {
  if (!endpoint) {
    return existingHeaders;
  }
  existingHeaders = existingHeaders
    .set(endpointKeyParam, `${GameTitleCodeName.FM7}|${endpoint}`)
    .set(v2ApolloEndpointKeyParam, endpoint);
  return existingHeaders;
}

export function overrideWoodstockEndpointKey(
  endpoint: string,
  existingHeaders: HttpHeaders = new HttpHeaders(),
): HttpHeaders {
  if (!endpoint) {
    return existingHeaders;
  }
  existingHeaders = existingHeaders
    .set(endpointKeyParam, `${GameTitleCodeName.FH5}|${endpoint}`)
    .set(v2WoostockEndpointKeyParam, endpoint);
  return existingHeaders;
}

export function overrideSteelheadEndpointKey(
  endpoint: string,
  existingHeaders: HttpHeaders = new HttpHeaders(),
): HttpHeaders {
  if (!endpoint) {
    return existingHeaders;
  }
  existingHeaders = existingHeaders
    .set(endpointKeyParam, `${GameTitleCodeName.FM8}|${endpoint}`)
    .set(v2SteelheadEndpointKeyParam, endpoint);
  return existingHeaders;
}
