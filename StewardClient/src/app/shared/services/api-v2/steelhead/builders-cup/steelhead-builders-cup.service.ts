import { Injectable } from '@angular/core';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';


/** Interface that represents Builder's Cup featured content. */
export interface BuildersCupFeaturedTour {
  name: string;
  description: string;
  isDisabled: boolean;
  openTimeUtc: DateTime;
  closeTimeUtc: DateTime;
}

/** The /v2/steelhead/buildersCup endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadBuildersCupService {
  private basePath: string = 'title/steelhead/buildersCup';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets the Steelhead lsp groups. */
  public getBuildersCupSchedule$(): Observable<BuildersCupFeaturedTour[]> {
    return this.api.getRequest$<BuildersCupFeaturedTour[]>(`${this.basePath}/schedule`);
  }
}
