import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BackgroundJob } from '@models/background-job';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** The /v2/steelhead/ugc/visibility/public|private endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadUgcVisibilityStatusService {
  private basePath: string = 'title/steelhead/ugc/visibility';
  constructor(private readonly api: ApiV2Service) {}

  /** Mark Ugc items public using background processing. */
  public markUgcItemsPublicUsingBackgroundJob$(ugcIds: string[]): Observable<BackgroundJob<void>> {
    const params = new HttpParams().set('useBackgroundProcessing', true);
    return this.api.postRequest$<BackgroundJob<void>>(`${this.basePath}/public`, ugcIds, params);
  }

  /** Mark Ugc items public. */
  public markUgcItemsPublic$(ugcIds: string[]): Observable<string[]> {
    const params = new HttpParams().set('useBackgroundProcessing', false);
    return this.api.postRequest$<string[]>(`${this.basePath}/public`, ugcIds, params);
  }

  /** Mark Ugc items private using background processing. */
  public markUgcItemsPrivateUsingBackgroundJob$(ugcIds: string[]): Observable<BackgroundJob<void>> {
    const params = new HttpParams().set('useBackgroundProcessing', true);
    return this.api.postRequest$<BackgroundJob<void>>(`${this.basePath}/private`, ugcIds, params);
  }

  /** Mark Ugc private item. */
  public markUgcItemsPrivate$(ugcIds: string[]): Observable<string[]> {
    const params = new HttpParams().set('useBackgroundProcessing', false);
    return this.api.postRequest$<string[]>(`${this.basePath}/private`, ugcIds, params);
  }
}
