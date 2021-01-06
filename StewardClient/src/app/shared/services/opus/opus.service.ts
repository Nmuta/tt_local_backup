import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IdentityQueryAlpha,
  IdentityQueryAlphaBatch,
  IdentityResultAlpha,
  IdentityResultAlphaBatch,
} from '@models/identity-query.model';
import { OpusPlayerDetails } from '@models/opus';
import { ApiService } from '@services/api';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

/** Handles calls to Sunrise API routes. */
@Injectable({
  providedIn: 'root',
})
export class OpusService {
  public basePath: string = 'v1/title/opus';

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
}
