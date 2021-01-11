import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApolloPlayerDetails } from '@models/apollo';
import {
  IdentityQueryAlpha,
  IdentityQueryAlphaBatch,
  IdentityResultAlpha,
  IdentityResultAlphaBatch,
} from '@models/identity-query.model';
import { LspGroups } from '@models/lsp-group';
import { ApiService } from '@services/api';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

/** Handles calls to Sunrise API routes. */
@Injectable({
  providedIn: 'root',
})
export class ApolloService {
  public basePath: string = 'v1/title/apollo';

  constructor(private readonly apiService: ApiService) {}

  /** Gets a single identity within this service. */
  public getPlayerIdentity(identityQuery: IdentityQueryAlpha): Observable<IdentityResultAlpha> {
    const queryBatch: IdentityQueryAlphaBatch = [identityQuery];
    return this.getPlayerIdentities(queryBatch).pipe(
      switchMap((data: IdentityResultAlphaBatch) => {
        const result = data[0];
        return of(result);
      }),
    );
  }

  /** Gets identities within this service. */
  public getPlayerIdentities(
    identityQueries: IdentityQueryAlphaBatch,
  ): Observable<IdentityResultAlphaBatch> {
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.apiService.postRequest<IdentityResultAlphaBatch>(
      `${this.basePath}/players/identities`,
      identityQueries,
      null,
      headers,
    );
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

  /** Gets the apollo lsp groups. */
  public getLspGroups(): Observable<LspGroups> {
    return this.apiService.getRequest<LspGroups>(`${this.basePath}/groups`);
  }
}
