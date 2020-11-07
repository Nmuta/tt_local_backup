import { Injectable } from '@angular/core';
import { OpusPlayerDetails } from '@models/opus';
import { ApiService } from '@services/api';
import _ from 'lodash';
import { Observable } from 'rxjs';

/** Handles calls to Sunrise API routes. */
@Injectable({
  providedIn: 'root',
})
export class ApolloService {
  public basePath: string = 'v2/title/opus';

  constructor(private readonly apiService: ApiService) {}

  /** Gets opus player details with a gamertag. This can be used to retrieve a XUID. */
  public getPlayerDetailsByGamertag(
    gamertag: string
  ): Observable<OpusPlayerDetails> {
    return this.apiService.getRequest<OpusPlayerDetails>(
      `${this.basePath}/player/gamertag(${gamertag})/details`
    );
  }
}
