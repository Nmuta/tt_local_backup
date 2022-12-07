import { Component, OnChanges } from '@angular/core';
import { GameTitle } from '@models/enums';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { UgcTableBaseComponent } from '../ugc-table.component';
import { UgcType } from '@models/ugc-filters';
import { Observable } from 'rxjs';
import { WoodstockService } from '@services/woodstock';
import { WoodstockUgcLookupService } from '@services/api-v2/woodstock/ugc/woodstock-ugc-lookup.service';
import { GuidLikeString } from '@models/extended-types';
import { LookupThumbnailsResult } from '@models/ugc-thumbnail-lookup';
import { WoodstockStorefrontService } from '@services/api-v2/woodstock/storefront/woodstock-storefront.service';

/** Displays woodstock UGC content in a table. */
@Component({
  selector: 'woodstock-ugc-table',
  templateUrl: '../ugc-table.component.html',
  styleUrls: ['../ugc-table.component.scss'],
})
export class WoodstockUgcTableComponent extends UgcTableBaseComponent implements OnChanges {
  public gameTitle = GameTitle.FH5;

  constructor(
    private readonly woodstockService: WoodstockService,
    private readonly woodstockStorefrontService: WoodstockStorefrontService,
    private readonly woodstockUgcLookupService: WoodstockUgcLookupService,
  ) {
    super();
  }

  /** Gets player UGC item. */
  public getUgcItem(id: string, type: UgcType): Observable<PlayerUgcItem> {
    // Only Layer Group has been moved to V2 endpoints
    if(type === UgcType.LayerGroup) {
      return this.woodstockStorefrontService.getLayerGroup$(id);
    }
    
    return this.woodstockService.getPlayerUgcItem$(id, type);
  }

  /** Retrieve Photo thumnbnails. */
  public retrievePhotoThumbnails(ugcIds: GuidLikeString[]): Observable<LookupThumbnailsResult[]> {
    return this.woodstockUgcLookupService.GetPhotoThumbnails$(ugcIds);
  }
}
