import { Injectable } from '@angular/core';
import { ApolloPlayerDetails } from '@models/apollo';
import { MSError } from '@models/error.model';
import {
  IdentityQueryAlpha,
  IdentityQueryAlphaBatch,
  IdentityResultAlpha,
  IdentityResultAlphaBatch,
  isGamertagQuery,
  isXuidQuery,
} from '@models/identity-query.model';
import { ApiService } from '@services/api';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

/** Handles calls to Sunrise API routes. */
@Injectable({
  providedIn: 'root',
})
export class ApolloService {
  public basePath: string = 'v1/title/apollo';

  constructor(private readonly apiService: ApiService) {}

  /** Gets a single identity within this service. */
  public getIdentity(
    identityQuery: IdentityQueryAlpha,
  ): Observable<IdentityResultAlpha> {
    return this.getIdentitySingle(identityQuery)
  }

  /** Gets identities within this service. */
  public getIdentities(
    identityQueries: IdentityQueryAlphaBatch,
  ): Observable<IdentityResultAlphaBatch> {
    return forkJoin([...identityQueries.map(q => this.getIdentitySingle(q))]);
  }

  /** Gets apollo player details with a gamertag. This can be used to retrieve a XUID. */
  public getPlayerDetailsByGamertag(gamertag: string): Observable<ApolloPlayerDetails> {
    return this.apiService
      .getRequest<ApolloPlayerDetails>(`${this.basePath}/player/gamertag(${gamertag})/details`)
      .pipe(
        map(details => {
          details.firstLoginUtc = !!details.firstLoginUtc ? new Date(details.firstLoginUtc) : null;
          details.lastLoginUtc = !!details.lastLoginUtc ? new Date(details.lastLoginUtc) : null;
          return details;
        }),
      );
  }

  private getIdentitySingle(query: IdentityQueryAlpha): Observable<IdentityResultAlpha> {
    return this.getIdentitySingleHelper(query).pipe(
      map(
        v =>
          <IdentityResultAlpha>{
            query: query,
            gamertag: v.gamertag,
            xuid: v.xuid,
          },
        catchError((e: string) =>
          of(<IdentityResultAlpha>{ query: query, error: ({ details: e } as unknown) as MSError }),
        ),
      ),
    );
  }

  private getIdentitySingleHelper(query: IdentityQueryAlpha): Observable<ApolloPlayerDetails> {
    if (isGamertagQuery(query)) {
      return this.apiService.getRequest<ApolloPlayerDetails>(
        `${this.basePath}/player/gamertag(${query.gamertag})/details`,
      );
    } else if (isXuidQuery(query)) {
      return this.apiService.getRequest<ApolloPlayerDetails>(
        `${this.basePath}/player/xuid(${query.xuid})/details`,
      );
    } else {
      return throwError(`query not recognized ${JSON.stringify(query)}`);
    }
  }
}
