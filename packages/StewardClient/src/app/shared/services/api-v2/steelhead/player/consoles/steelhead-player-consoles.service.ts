import { Injectable } from '@angular/core';
import { SteelheadConsoleDetailsEntry, SteelheadSharedConsoleUser } from '@models/steelhead';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** The /v2/title/steelhead/player/{xuid} endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadPlayerConsolesService {
  public readonly basePath: string = 'title/steelhead/player';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets consoles by XUID. */
  public getConsoleDetailsByXuid$(xuid: BigNumber): Observable<SteelheadConsoleDetailsEntry[]> {
    return this.api.getRequest$<SteelheadConsoleDetailsEntry[]>(
      `${this.basePath}/${xuid}/consoles`,
    );
  }

  /** Gets shared console users by XUID. */
  public getSharedConsoleUsersByXuid$(xuid: BigNumber): Observable<SteelheadSharedConsoleUser[]> {
    return this.api.getRequest$<SteelheadSharedConsoleUser[]>(
      `${this.basePath}/${xuid}/sharedConsoleUsers`,
    );
  }
}
