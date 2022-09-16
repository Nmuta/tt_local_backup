import { Injectable } from '@angular/core';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** The /v2/title/steelhead/console endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadConsolesService {
  public readonly basePath: string = 'title/steelhead/console';
  constructor(private readonly api: ApiV2Service) {}

  /** Updates a console's ban status by the Console's ID. */
  public putBanStatusByConsoleId$(consoleId: string, isBanned: boolean): Observable<void> {
    return this.api.putRequest$<void>(`${this.basePath}/${consoleId}/banStatus`, isBanned);
  }
}
