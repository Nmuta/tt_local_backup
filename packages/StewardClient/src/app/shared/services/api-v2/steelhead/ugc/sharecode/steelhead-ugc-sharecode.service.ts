import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BackgroundJob } from '@models/background-job';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

export interface GenerateSharecodeResponse {
  sharecode: string;
}

/** The /v2/steelhead/ugc/{ugcId}/sharecode endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadUgcSharecodeService {
  private basePath: string = 'title/steelhead/ugc';
  constructor(private readonly api: ApiV2Service) {}

  /** Generate sharecode for UGC. */
  public ugcGenerateSharecode$(ugcId: string): Observable<GenerateSharecodeResponse> {
    return this.api.postRequest$<GenerateSharecodeResponse>(
      `${this.basePath}/${ugcId}/sharecode`,
      undefined,
    );
  }

  /** Bulk generate sharecodes for UGC. */
  public ugcGenerateSharecodesUsingBackgroundJob$(
    ugcIds: string[],
  ): Observable<BackgroundJob<void>> {
    const params = new HttpParams().set('useBackgroundProcessing', true);
    return this.api.postRequest$<BackgroundJob<void>>(`${this.basePath}/sharecode`, ugcIds, params);
  }
}
