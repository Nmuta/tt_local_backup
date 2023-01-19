import { Injectable } from '@angular/core';
import { BackgroundJob } from '@models/background-job';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** The /v2/woodstock/ugc/hide endpoints. */
@Injectable({
  providedIn: 'root',
})
export class WoodstockUgcHideService {
  private basePath: string = 'title/woodstock/ugc/hide';
  constructor(private readonly api: ApiV2Service) {}

  /** Hide multiple Ugc. */
  public hideMultipleUgc$(ugcIds: string[]): Observable<BackgroundJob<void>> {
    return this.api.postRequest$<BackgroundJob<void>>(`${this.basePath}`, ugcIds);
  }
}
