import { Injectable } from '@angular/core';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** The /v2/steelhead/{ugcId}/geoFlags endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadUgcGeoFlagsService {
  private basePath: string = 'title/steelhead/ugc';
  constructor(private readonly api: ApiV2Service) {}

  /** Sets a UGC item's GeoFlags. */
  public setUgcGeoFlag$(ugcId: string, geoFlags: string[]): Observable<void> {
    return this.api.postRequest$<void>(`${this.basePath}/${ugcId}/geoFlags`, geoFlags);
  }
}
