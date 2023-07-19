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
