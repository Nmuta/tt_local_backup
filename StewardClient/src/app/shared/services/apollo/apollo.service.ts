import { Injectable } from '@angular/core';
import { ApolloPlayerDetails } from '@models/apollo';
import { ApiService } from '@services/api';
import _ from 'lodash';
import { Observable } from 'rxjs';

/** Handles calls to Sunrise API routes. */
@Injectable({
  providedIn: 'root',
})
export class ApolloService {
  public basePath: string = 'v2/title/apollo';

  constructor(private readonly apiService: ApiService) {}

  /** Gets gravity player details with a gamertag. This can be used to retrieve a XUID. */
  public getPlayerDetailsByGamertag(
    gamertag: string
  ): Observable<ApolloPlayerDetails> {
    return this.apiService.getRequest<ApolloPlayerDetails>(
      `${this.basePath}/player/gamertag(${gamertag})/details`
    );
  }
}
