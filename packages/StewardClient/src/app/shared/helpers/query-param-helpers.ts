import { HttpParams } from '@angular/common/http';

/** Adds array to query params. */
export function addQueryParamArray(
  params: HttpParams,
  paramName: string,
  paramValues: string[],
): HttpParams {
  for (const value of paramValues) {
    params = params.append(paramName, value);
  }

  return params;
}

/** Add environment and slot selections to HttpParams. */
export function addEnvironmentAndSlotHttpParams(
  environment: string,
  slot: string,
  existingParams?: HttpParams,
): HttpParams {
  let params = existingParams ?? new HttpParams();

  if (!!environment && environment !== '') {
    params = params.set('environment', environment);
  }

  if (!!slot && slot !== '') {
    params = params.set('slot', slot);
  }

  return params;
}
