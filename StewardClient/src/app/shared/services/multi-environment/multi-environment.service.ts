import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { GameTitle } from '@models/enums';
import {
  IdentityQueryBeta,
  IdentityQueryAlpha,
  IdentityResultAlpha,
  IdentityResultBeta,
  isValidAlphaQuery,
  IdentityQueryBetaIntersection,
  IdentityResultAlphaBatch,
  IdentityResultBetaBatch,
} from '@models/identity-query.model';
import { LspDefaultEndpoints } from '@models/lsp-endpoints';
import { RecursivePartial } from '@models/unprocessed';
import { Store } from '@ngxs/store';
import { ApolloService } from '@services/apollo';
import { OpusService } from '@services/opus';
import { SteelheadService } from '@services/steelhead';
import { SunriseService } from '@services/sunrise';
import { WoodstockService } from '@services/woodstock';
import { AppState } from '@shared/state/app-state';
import { UserSettingsStateModel } from '@shared/state/user-settings/user-settings.state';
import { every, merge, chain, get, set, flatMap, values } from 'lodash';
import { Observable, of, combineLatest } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

/** Either an Alpha or Beta query. */
export type AnyIdentityQuery = IdentityQueryBeta & IdentityQueryAlpha;

/** A set of identity results for all titles across many users. Keys match @see EnvSet */
export interface ResultSet {
  sunrise: IdentityResultAlpha[];
  opus: IdentityResultAlpha[];
  apollo: IdentityResultAlpha[];
  gravity: IdentityResultBeta[];
  steelhead: IdentityResultAlpha[];
  woodstock: IdentityResultAlpha[];
}

/** A set of endpoints for all titles. Keys match @see ResultSet */
export interface EnvSet {
  sunrise: string;
  opus: undefined;
  apollo: string;
  gravity: undefined;
  steelhead: string;
  woodstock: string;
}

/** A set of identity results across many users, for both Retail and whatever EnvSet is currently selected. */
export interface Results {
  retail: ResultSet;
  standard: ResultSet;
  whichEnv: EnvSet;
}

/** A set of identity results across many users, for both Retail and whatever EnvSet is currently selected. */
export interface ResultsOneTitle<T extends keyof ResultSet> extends RecursivePartial<Results> {
  retail: Pick<ResultSet, T>;
  standard: Pick<ResultSet, T>;
  whichEnv: Pick<EnvSet, T>;
}

type ResultsRetailOnly<T extends keyof ResultSet> = Pick<ResultsOneTitle<T>, 'retail'>;
type ResultsStandardOnly<T extends keyof ResultSet> = Pick<
  ResultsOneTitle<T>,
  'standard' | 'whichEnv'
>;
type ResultsComplete<T extends keyof ResultSet> = Pick<
  ResultsOneTitle<T>,
  'retail' | 'standard' | 'whichEnv'
>;
type ResultsUnion<T extends keyof ResultSet> = ResultsRetailOnly<T> &
  ResultsStandardOnly<T> &
  ResultsComplete<T>;

type ResultsIntersection<T extends keyof ResultSet> =
  | ResultsComplete<T>
  | ResultsStandardOnly<T>
  | ResultsRetailOnly<T>;
/** A set of Identity Results across all titles for a single user. */
export interface SingleUserResultSet {
  sunrise: IdentityResultAlpha;
  opus: IdentityResultAlpha;
  apollo: IdentityResultAlpha;
  gravity: IdentityResultBeta;
  steelhead: IdentityResultAlpha;
  woodstock: IdentityResultAlpha;
}

/** Identity information for a single user, for both Retail and whatever EnvSet is currently selected. */
export interface SingleUserResult {
  query: AnyIdentityQuery;
  retail: SingleUserResultSet;
  standard: SingleUserResultSet;
  whichEnv: EnvSet;
}

/** Utilities for querying multiple environments/titles at once. */
@Injectable({
  providedIn: 'root',
})
export class MultiEnvironmentService {
  constructor(
    private readonly woodstock: WoodstockService,
    private readonly steelhead: SteelheadService,
    private readonly sunrise: SunriseService,
    private readonly apollo: ApolloService,
    private readonly opus: OpusService,
    private readonly store: Store,
  ) {}

  /** Retreive player identities across all active environments. */
  public getPlayerIdentities$(
    lookupType: keyof IdentityQueryBetaIntersection,
    newQueries: AnyIdentityQuery[],
  ): Observable<SingleUserResult[]> {
    const queryIsAlphaCompatible = every(newQueries, q => isValidAlphaQuery(q));
    // const queryIsBetaCompatible = every(newQueries, q => isValidBetaQuery(q));

    const userSettings = this.store.selectSnapshot<UserSettingsStateModel>(
      (state: AppState) => state.userSettings,
    );

    const queries: Observable<RecursivePartial<ResultsIntersection<GameTitle>>>[] = [];

    /** Produces a filled out results block for the given title. */
    function mapTitleToStandardAndMaybeRetail<
      T extends keyof ResultSet,
      IdentityResultT extends ResultSet[T],
      TitleEndpointKey,
    >(
      results: IdentityResultT,
      entry: T,
      endpointKey: TitleEndpointKey,
      retailEndpointKey: TitleEndpointKey,
    ): ResultsComplete<T> | ResultsStandardOnly<T> {
      if (endpointKey === retailEndpointKey) {
        return <ResultsComplete<T>>{
          retail: { [entry]: results as ResultSet[T] },
          standard: { [entry]: results as ResultSet[T] },
          whichEnv: { [entry]: endpointKey as unknown },
        };
      }

      return <ResultsStandardOnly<T>>{
        standard: { [entry]: results as ResultSet[T] },
        whichEnv: { [entry]: endpointKey as unknown },
      };
    }

    /** Adapts the given method$ to create the target results, adding the needed queries to the list. */
    function makeQueryAndPopulate<
      T extends keyof ResultSet,
      TitleEndpointKey,
      IdentityQueryT extends AnyIdentityQuery,
      IdentityResultTBatch extends IdentityResultAlphaBatch | IdentityResultBetaBatch,
    >(
      entry: T,
      method$: (
        queries: IdentityQueryT[],
        endpointOverrideKey?: TitleEndpointKey,
      ) => Observable<IdentityResultTBatch>,
      endpointKey: TitleEndpointKey,
      retailEndpointKey: TitleEndpointKey,
    ) {
      // handle the "standard" case, possibly populating retail
      queries.push(
        method$(newQueries as IdentityQueryT[]).pipe(
          map(results =>
            mapTitleToStandardAndMaybeRetail(
              results as ResultSet[T],
              entry,
              endpointKey,
              retailEndpointKey,
            ),
          ),
          catchError(_ => of(undefined)),
        ),
      );

      // if we didn't already populate retail, also make that request
      if (endpointKey !== retailEndpointKey) {
        queries.push(
          method$(newQueries as IdentityQueryT[], retailEndpointKey).pipe(
            map(results => {
              return <ResultsRetailOnly<T>>{
                retail: { [entry]: results as ResultSet[T] },
              };
            }),
            catchError(_ => of(undefined)),
          ),
        );
      }
    }

    if (queryIsAlphaCompatible) {
      // All of these require o.fn$.bind(o) syntax, because the default behavior in JS
      // when passing plain functions around is to not also pass the "this" context.
      // Calling bind(o) produces a new function with a "permanently" bound `this = o`, rather than the usual
      // behavior in JS of inferring it from context.
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind
      makeQueryAndPopulate(
        GameTitle.FH4,
        this.sunrise.getPlayerIdentities$.bind(this.sunrise),
        userSettings.sunriseEndpointKey,
        LspDefaultEndpoints.sunrise,
      );
      makeQueryAndPopulate(
        GameTitle.FH3,
        this.opus.getPlayerIdentities$.bind(this.opus),
        undefined,
        undefined,
      );
      makeQueryAndPopulate(
        GameTitle.FM7,
        this.apollo.getPlayerIdentities$.bind(this.apollo),
        userSettings.apolloEndpointKey,
        LspDefaultEndpoints.apollo,
      );

      makeQueryAndPopulate(
        GameTitle.FH5,
        this.woodstock.getPlayerIdentities$.bind(this.woodstock),
        userSettings.woodstockEndpointKey,
        LspDefaultEndpoints.woodstock,
      );

      // TODO: Remove once steelhead is available for production
      if (!environment.production) {
        makeQueryAndPopulate(
          GameTitle.FM8,
          this.steelhead.getPlayerIdentities$.bind(this.steelhead),
          userSettings.steelheadEndpointKey,
          LspDefaultEndpoints.steelhead,
        );
      }
    }

    // Leaving as example for any future beta compatible queries
    // if (queryIsBetaCompatible) {
    //   makeQueryAndPopulate(
    //     GameTitle.Street,
    //     this.gravity.getPlayerIdentities$.bind(this.gravity),
    //     undefined,
    //     undefined,
    //   );
    // }

    // get the value and replace it in the source if it's still there
    return combineLatest(queries).pipe(
      map(results => {
        // group all the partial results together into a single object
        const groupedResults = results.reduce(
          (accum, v) => merge(accum, v),
          {},
        ) as ResultsUnion<GameTitle>;

        // a lookup where we will store the by-user results
        const lookup: Record<string, SingleUserResult> = chain(newQueries)
          .map(q => [
            q[lookupType],
            <SingleUserResult>{
              query: q,
              retail: {},
              standard: {},
              whichEnv: groupedResults.whichEnv,
            },
          ])
          .fromPairs()
          .value();

        // copy over all the results for all users
        const topLevels: (keyof SingleUserResult)[] = ['retail', 'standard'];
        const titles: (keyof SingleUserResultSet)[] = values(GameTitle);

        const paths = flatMap(topLevels, topLevel =>
          flatMap(titles, title => `${topLevel}.${title}`),
        );

        for (const path of paths) {
          // this copies over the results for a single user
          for (const entry of get(groupedResults, path, [])) {
            const key = entry.query[lookupType];
            set(lookup[key], path, entry);
          }
        }

        // throw out the lookup key and return the list (order may not be preserved)
        return values(lookup);
      }),
    );
  }
}
