import { Injectable } from '@angular/core';
import { SunrisePlayerDetails, SunriseUserFlags } from '@models/sunrise';
import { ApiService } from '@services/api';
import { Observable } from 'rxjs';

/** Handles calls to Sunrise API routes. */
@Injectable({
  providedIn: 'root'
})
export class SunriseService {
  public basePath: string = 'v2/title/sunrise';

  constructor(private readonly apiService: ApiService) {}

  /** Gets gravity player details with a gamertag. This can be used to retrieve a XUID. */
  public getPlayerDetailsByGamertag(
    gamertag: string
  ): Observable<SunrisePlayerDetails> {
    return this.apiService.getRequest<SunrisePlayerDetails>(
      `${this.basePath}/player/gamertag(${gamertag})/details`
    );
  }

  /** Gets user flags by a XUID. */
  public getFlagsByXuid(
    xuid: number
  ): Observable<SunriseUserFlags> {
    return this.apiService.getRequest<SunriseUserFlags>(
      `${this.basePath}/player/xuid(${xuid})/userFlags`
    );
  }

  /** Gets user flags by a XUID. */
  public putFlagsByXuid(
    xuid: number,
    flags: SunriseUserFlags
  ): Observable<SunriseUserFlags> {
    return this.apiService.putRequest<SunriseUserFlags>(
      `${this.basePath}/player/xuid(${xuid})/userFlags`,
      flags,
    );
  }
}
