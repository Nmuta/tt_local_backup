import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GuidLikeString } from '@models/extended-types';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { UgcSearchFilters, UgcType } from '@models/ugc-filters';
import { LookupThumbnailsResult } from '@models/ugc-thumbnail-lookup';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** The /v2/title/steelhead/ugc/lookup endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadUgcLookupService {
  public readonly basePath: string = 'title/steelhead/ugc/lookup';
  constructor(private readonly api: ApiV2Service) {}

  /** Search UGC. */
  public searchUgc$(parameters: UgcSearchFilters): Observable<PlayerUgcItem[]> {
    return this.api.postRequest$<PlayerUgcItem[]>(
      `${this.basePath}/${parameters.ugcType}`,
      parameters,
      undefined,
    );
  }

  /** Gets UGC livery item. */
  public getUgcLivery$(ugcId: GuidLikeString): Observable<PlayerUgcItem> {
    return this.api.getRequest$<PlayerUgcItem>(`${this.basePath}/livery/${ugcId}`);
  }

  /** Gets UGC photo item. */
  public getUgcPhoto$(ugcId: GuidLikeString): Observable<PlayerUgcItem> {
    return this.api.getRequest$<PlayerUgcItem>(`${this.basePath}/photo/${ugcId}`);
  }

  /** Gets UGC photo thumbnails. */
  public getUgcPhotoThumbnails$(ugcIds: GuidLikeString[]): Observable<LookupThumbnailsResult[]> {
    return this.api.postRequest$<LookupThumbnailsResult[]>(
      `${this.basePath}/photos/thumbnails`,
      ugcIds,
    );
  }

  /** Gets UGC tune item. */
  public getUgcTune$(ugcId: GuidLikeString): Observable<PlayerUgcItem> {
    return this.api.getRequest$<PlayerUgcItem>(`${this.basePath}/tune/${ugcId}`);
  }

  /** Gets UGC item by sharecode. */
  public getUgcBySharecode$(shareCode: string, contentType: UgcType): Observable<PlayerUgcItem[]> {
    const httpParams = new HttpParams().append('ugcType', contentType.toString());
    return this.api.getRequest$<PlayerUgcItem[]>(
      `${this.basePath}/shareCode/${shareCode}`,
      httpParams,
    );
  }
}
