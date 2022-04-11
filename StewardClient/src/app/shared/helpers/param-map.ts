import { ActivatedRoute, ActivatedRouteSnapshot, ParamMap } from '@angular/router';
import { merge, reverse } from 'lodash';
import { combineLatest, map, Observable, startWith } from 'rxjs';

/**
 * Merges all params from root to the current route.
 * If duplicate keys exist, later (lower) keys override the prior values.
 * @param {ActivatedRoute} route The route to merge.
 * @returns {Observable<Record<string, string>>} The merged param map, as an object dictionary.
 */
export function mergedParamMap$(route: ActivatedRoute): Observable<Record<string, string>> {
  const allParamMaps: Observable<ParamMap>[] = [];
  let currentRoute = route;
  do {
    allParamMaps.push(currentRoute.paramMap);
    currentRoute = currentRoute.parent;
  } while (!!currentRoute);

  const allExistingParamMaps = allParamMaps
    .filter(paramMap => !!paramMap)
    .map(paramMap => paramMap.pipe(startWith(null)));

  return combineLatest(allExistingParamMaps).pipe(
    map(paramMaps => {
      const paramMapObjects = paramMaps.map(paramMap => {
        if (!paramMap) {
          return paramMap;
        }
        const paramMapObject: Record<string, string> = {};
        for (const key of paramMap?.keys) {
          paramMapObject[key] = paramMap.get(key);
        }
        return paramMapObject;
      });

      // flip first, so "later" (lower) values will override "earlier" (higher) values.
      const paramMapObjectsHighestFirst = reverse(paramMapObjects);
      return merge({}, ...paramMapObjectsHighestFirst);
    }),
  );
}

/**
 * Merges all params from root to the current route.
 * If duplicate keys exist, later (lower) keys override the prior values.
 * @param {ActivatedRouteSnapshot} route The route to merge.
 * @param {boolean} includeChildren When true, starts from the deepest nested *.firstChild snapshot.
 * @returns {Record<string, string>} The merged param map, as an object dictionary.
 */
export function mergedParamMap(
  route: ActivatedRouteSnapshot,
  includeChildren: boolean = false,
): Record<string, string> {
  const allParamMaps: ParamMap[] = [];
  let currentRoute = route;

  if (includeChildren) {
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }
  }

  do {
    allParamMaps.push(currentRoute.paramMap);
    currentRoute = currentRoute.parent;
  } while (!!currentRoute);

  const paramMapObjects = allParamMaps.map(paramMap => {
    if (!paramMap) {
      return paramMap;
    }
    const paramMapObject: Record<string, string> = {};
    for (const key of paramMap?.keys) {
      paramMapObject[key] = paramMap.get(key);
    }
    return paramMapObject;
  });

  // flip first, so "later" (lower) values will override "earlier" (higher) values.
  const paramMapObjectsHighestFirst = reverse(paramMapObjects);
  return merge({}, ...paramMapObjectsHighestFirst);
}
