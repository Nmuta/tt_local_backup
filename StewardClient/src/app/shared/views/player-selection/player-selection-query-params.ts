import { ActivatedRoute, Params, Router } from '@angular/router';
import { QueryParam } from '@models/query-params';
import { cloneDeep } from 'lodash';

/** The XUID-based player selection query param. */
export interface XuidPlayerSelectionQueryParam {
  [QueryParam.Xuid]: string[];
}

/** The Gamertag-based player selection query param. */
export interface GamertagPlayerSelectionQueryParam {
  [QueryParam.Gamertag]: string[];
}

/** The T10Id-based player selection query param. */
export interface T10IdPlayerSelectionQueryParam {
  [QueryParam.T10Id]: string[];
}

/** Represents a valid player selection query param. */
export type PlayerSelectionQueryParam =
  | XuidPlayerSelectionQueryParam
  | GamertagPlayerSelectionQueryParam
  | T10IdPlayerSelectionQueryParam;

/** Handle old player selection query params. Returns true if query params were converted  */
export function handleOldPlayerSelectionQueryParams(params: Params, router: Router): boolean {
  const lookupType = params['lookupType'];
  const lookupName = params['lookupName'];

  if (hasParam(lookupType) && hasParam(lookupName)) {
    router.navigate([], {
      queryParams: {
        [lookupType]: lookupName,
      },
      replaceUrl: true,
    });
    return true;
  }

  return false;
}

/** Maps router query params to player selection query param object. */
export function mapPlayerSelectionQueryParam(params: Params): PlayerSelectionQueryParam {
  const gamertagParam = params[QueryParam.Gamertag];
  const xuidParam = params[QueryParam.Xuid];
  const t10IdParam = params[QueryParam.T10Id];

  /** Gets all lookup names from the param value.  */
  function getParamList(param: string): string[] {
    return param.split(',');
  }

  if (hasParam(gamertagParam)) {
    return {
      [QueryParam.Gamertag]: getParamList(gamertagParam),
    };
  }

  if (hasParam(xuidParam)) {
    return {
      [QueryParam.Xuid]: getParamList(xuidParam),
    };
  }

  if (hasParam(t10IdParam)) {
    return {
      [QueryParam.T10Id]: getParamList(t10IdParam),
    };
  }

  return null;
}

/** Add new lookup names to existing query params in the URL. */
export function addToPlayerSelectionQueryParams(
  newValues: string,
  lookupType: string,
  maxIdentities: number,
  route: ActivatedRoute,
  router: Router,
): string[] {
  let cutLookupList = [];
  let updatedQueryParams = newValues
    .split(/,|\r|\n/)
    .map(v => v.trim())
    .filter(v => v.length > 0);

  const currentQueryParams = route.snapshot.queryParams[lookupType]?.trim() || '';
  if (currentQueryParams.trim().length > 0) {
    updatedQueryParams.push(...currentQueryParams.split(','));
  }

  // Removes duplicates
  updatedQueryParams = [...new Set(updatedQueryParams)];

  if (updatedQueryParams?.length > maxIdentities) {
    cutLookupList = updatedQueryParams.slice(maxIdentities, updatedQueryParams.length);
    updatedQueryParams = updatedQueryParams.slice(0, maxIdentities);
  }

  routeToUpdatedPlayerSelectionQueryParams(
    route.snapshot.queryParams,
    lookupType,
    updatedQueryParams.join(','),
    router,
  );
  return cutLookupList;
}

/** Navigates route with update player selection query params. */
export function routeToUpdatedPlayerSelectionQueryParams(
  currentParams: Params,
  lookupType: string,
  lookupNames: string,
  router: Router,
): void {
  const updatedParams = cloneDeep(currentParams);

  // Clear any old player selection params
  updatedParams[QueryParam.Xuid] = undefined;
  updatedParams[QueryParam.Gamertag] = undefined;
  updatedParams[QueryParam.T10Id] = undefined;

  // Set new param
  updatedParams[lookupType] = lookupNames;

  router.navigate([], {
    queryParams: updatedParams,
  });
}

/** Returns whether param exists and is not an empty string. */
function hasParam(param: string): boolean {
  return !!param && param?.trim().length > 0;
}
