import { Injectable } from '@angular/core';
import { ApolloPlayerDetails } from '@models/apollo';
import { ApiService } from '@services/api';
import _ from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/** Handles calls to Sunrise API routes. */
@Injectable({
  providedIn: 'root',
})
export class ApolloService {
  public basePath: string = 'v2/title/apollo';

  constructor(private readonly apiService: ApiService) {}

  /** Gets apollo player details with a gamertag. This can be used to retrieve a XUID. */
  public getPlayerDetailsByGamertag(
    gamertag: string
  ): Observable<ApolloPlayerDetails> {
    return this.apiService.getRequest<ApolloPlayerDetails>(
      `${this.basePath}/player/gamertag(${gamertag})/details`
    )
    .pipe(
      map(details => {
        details.firstLoginUtc = !!details.firstLoginUtc ? new Date(details.firstLoginUtc) : null;
        details.lastLoginUtc = !!details.lastLoginUtc ? new Date(details.lastLoginUtc) : null;
        return details;
      })
    );
  }
}
