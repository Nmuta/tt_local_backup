import { isEqual, keys, uniq } from 'lodash';
import { filter, map, MonoTypeOperatorFunction, Observable, pairwise, startWith } from 'rxjs';

export enum PaginatorQueryParams {
  Index = 'pi',
  Size = 'ps',
}

/** Ignores paginator only query param changes. Should be placed on query param event observable. */
export function ignorePaginatorQueryParams<T>(): MonoTypeOperatorFunction<T> {
  return function (source$: Observable<T>): Observable<T> {
    return source$.pipe(
      startWith(null),
      pairwise(),
      filter(([o, n]) => {
        // Allow through if old value is null
        if (!o) {
          return true;
        }

        const allKeys = uniq(keys(o).concat(keys(n)));
        const keyDiffs = allKeys
          .filter(k => !isEqual(o[k], n[k]))
          .filter(
            p =>
              !p.startsWith(PaginatorQueryParams.Index) && !p.startsWith(PaginatorQueryParams.Size),
          );

        return keyDiffs.length > 0;
      }),
      map(([_o, n]) => n),
    );
  };
}
