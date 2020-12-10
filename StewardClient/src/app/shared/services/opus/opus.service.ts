import { Injectable } from '@angular/core';
import { MSError } from '@models/error.model';
import {
  IdentityQueryAlpha,
  IdentityQueryAlphaBatch,
  IdentityResultAlpha,
  IdentityResultAlphaBatch,
  isGamertagQuery,
  isXuidQuery,
} from '@models/identity-query.model';
import { OpusPlayerDetails } from '@models/opus';
import { ApiService } from '@services/api';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

/** Handles calls to Sunrise API routes. */
@Injectable({
  providedIn: 'root',
})
export class OpusService {
  public basePath: string = 'v1/title/opus';

  constructor(private readonly apiService: ApiService) {}

  /** Gets a single identity within this service. */
  public getIdentity(identityQuery: IdentityQueryAlpha): Observable<IdentityResultAlpha> {
    return this.getIdentitySingle(identityQuery);
  }

  /** Gets identities within this service. */
  public getIdentities(
    identityQueries: IdentityQueryAlphaBatch,
  ): Observable<IdentityResultAlphaBatch> {
    return forkJoin([...identityQueries.map(q => this.getIdentitySingle(q))]);
  }

  /** Gets opus player details with a gamertag. This can be used to retrieve a XUID. */
  public getPlayerDetailsByGamertag(gamertag: string): Observable<OpusPlayerDetails> {
    return this.apiService
      .getRequest<OpusPlayerDetails>(`${this.basePath}/player/gamertag(${gamertag})/details`)
      .pipe(
        map(details => {
          details.firstLoginUtc = !!details.firstLoginUtc ? new Date(details.firstLoginUtc) : null;
          details.lastLoginUtc = !!details.lastLoginUtc ? new Date(details.lastLoginUtc) : null;
          return details;
        }),
      );
  }

  private getIdentitySingle(query: IdentityQueryAlpha): Observable<IdentityResultAlpha> {
    return this.getIdentityHelper(query).pipe(
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

  private getIdentityHelper(query: IdentityQueryAlpha): Observable<OpusPlayerDetails> {
    if (isGamertagQuery(query)) {
      return this.apiService.getRequest<OpusPlayerDetails>(
        `${this.basePath}/player/gamertag(${query.gamertag})/details`,
      );
    } else if (isXuidQuery(query)) {
      return this.apiService.getRequest<OpusPlayerDetails>(
        `${this.basePath}/player/xuid(${query.xuid})/details`,
      );
    } else {
      return throwError(`query not recognized ${JSON.stringify(query)}`);
    }
  }
}
