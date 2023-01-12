import { Injectable } from '@angular/core';
import { BackgroundJob } from '@models/background-job';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** The /v2/sunrise/ugc/hide endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SunriseUgcHideService {
  private basePath: string = 'title/sunrise/ugc';
  constructor(private readonly api: ApiV2Service) {}

  /** Hide multiple Ugc. */
  public hideMultipleUgc$(ugcIds: string[]): Observable<BackgroundJob<void>> {
    return this.api.postRequest$<BackgroundJob<void>>(`${this.basePath}/hide`, ugcIds);
  }
}
