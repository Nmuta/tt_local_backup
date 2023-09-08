import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BackgroundJob } from '@models/background-job';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** The /v2/woodstock/ugc/visibility/public|private endpoints. */
@Injectable({
  providedIn: 'root',
})
export class WoodstockUgcVisibilityStatusService {
  private basePath: string = 'title/woodstock/ugc/visibility';
  constructor(private readonly api: ApiV2Service) {}

  /** Mark Ugc items public using background processing. */
  public publicUgcItemsUsingBackgroundJob$(ugcIds: string[]): Observable<BackgroundJob<void>> {
    const params = new HttpParams().set('useBackgroundProcessing', true);
    return this.api.postRequest$<BackgroundJob<void>>(`${this.basePath}/public`, ugcIds, params);
  }

  /** Mark Ugc items public. */
  public publicUgcItems$(ugcIds: string[]): Observable<string[]> {
    const params = new HttpParams().set('useBackgroundProcessing', false);
    return this.api.postRequest$<string[]>(`${this.basePath}/public`, ugcIds, params);
  }

  /** Mark Ugc items private using background processing. */
  public privateUgcItemsUsingBackgroundJob$(ugcIds: string[]): Observable<BackgroundJob<void>> {
    const params = new HttpParams().set('useBackgroundProcessing', true);
    return this.api.postRequest$<BackgroundJob<void>>(`${this.basePath}/private`, ugcIds, params);
  }

  /** Mark Ugc private item. */
  public privateUgcItems$(ugcIds: string[]): Observable<string[]> {
    const params = new HttpParams().set('useBackgroundProcessing', false);
    return this.api.postRequest$<string[]>(`${this.basePath}/private`, ugcIds, params);
  }
}
