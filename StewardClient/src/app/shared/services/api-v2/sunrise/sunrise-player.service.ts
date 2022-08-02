import { Injectable } from '@angular/core';
import { ProfileRollbackHistory } from '@models/profile-rollback-history.model';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';
import { ApiV2Service } from '../api-v2.service';

/** The /v2/sunrise/player endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SunrisePlayerService {
  private basePath: string = 'title/sunrise/player';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets user save rollback history by a XUID. */
  public getProfileRollbackHistoryXuid$(xuid: BigNumber): Observable<ProfileRollbackHistory[]> {
    return this.api.getRequest$<ProfileRollbackHistory[]>(
      `${this.basePath}/${xuid}/saveRollbackLog`,
    );
  }
}
