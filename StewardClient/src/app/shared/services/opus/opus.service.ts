import { Injectable } from '@angular/core';
import { OpusPlayerDetails } from '@models/opus';
import { ApiService } from '@services/api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/** Handles calls to Sunrise API routes. */
@Injectable({
  providedIn: 'root',
})
export class OpusService {
  public basePath: string = 'title/opus';

  constructor(private readonly apiService: ApiService) {}

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
