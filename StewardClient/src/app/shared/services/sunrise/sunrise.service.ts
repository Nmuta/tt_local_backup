import { Injectable } from '@angular/core';
import { SunrisePlayerDetails } from '@models/sunrise';
import { ApiService } from '@services/api';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/** Handles calls to Sunrise API routes. */
@Injectable({
  providedIn: 'root'
})
export class SunriseService {
  public basePath: string = 'v2/title/sunrise';

  constructor(private readonly apiService: ApiService) {}

  /** Gets gravity player details with a gamertag. */
  public getPlayerDetailsByGamertag(
    gamertag: string
  ): Observable<SunrisePlayerDetails> {
    return this.apiService.getRequest<SunrisePlayerDetails>(
      `${this.basePath}/player/gamertag(${gamertag})/details`
    );
  }
}
