import { HttpHeaders } from '@angular/common/http';
import { GameTitleCodeName } from '@models/enums';

const endpointKeyParam = 'endpointKey';

export function overrideSunriseEndpointKey(
  endpoint: string,
  existingHeaders: HttpHeaders = new HttpHeaders(),
): HttpHeaders {
  if (!endpoint) {
    return existingHeaders;
  }
  return existingHeaders.set(endpointKeyParam, `${GameTitleCodeName.FH4}|${endpoint}`);
}

export function overrideApolloEndpointKey(
  endpoint: string,
  existingHeaders: HttpHeaders = new HttpHeaders(),
): HttpHeaders {
  if (!endpoint) {
    return existingHeaders;
  }
  return existingHeaders.set(endpointKeyParam, `${GameTitleCodeName.FM7}|${endpoint}`);
}

export function overrideWoodstockEndpointKey(
  endpoint: string,
  existingHeaders: HttpHeaders = new HttpHeaders(),
): HttpHeaders {
  if (!endpoint) {
    return existingHeaders;
  }
  return existingHeaders.set(endpointKeyParam, `${GameTitleCodeName.FH5}|${endpoint}`);
}

export function overrideSteelheadEndpointKey(
  endpoint: string,
  existingHeaders: HttpHeaders = new HttpHeaders(),
): HttpHeaders {
  if (!endpoint) {
    return existingHeaders;
  }
  return existingHeaders.set(endpointKeyParam, `${GameTitleCodeName.FM8}|${endpoint}`);
}
