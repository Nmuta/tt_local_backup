import { Injectable } from '@angular/core';
import { GuidLikeString } from '@models/extended-types';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';
import { LookupThumbnailsResult } from '../../../../models/ugc-thumbnail-lookup';

/** The /v2/woodstock/ugc/lookup endpoints. */
@Injectable({
  providedIn: 'root',
})
export class WoodstockUgcLookupService {
  private basePath: string = 'title/woodstock/ugc/lookup';
  constructor(private readonly api: ApiV2Service) {}

  /** Lookup Photo UGC thumbnails. */
  public GetPhotoThumbnails$(ugcIds: GuidLikeString[]): Observable<LookupThumbnailsResult[]> {
    return this.api.postRequest$<LookupThumbnailsResult[]>(
      `${this.basePath}/photos/thumbnails`,
      ugcIds,
    );
  }
}
