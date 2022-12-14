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
    private readonly woodstockUgcLookupService: WoodstockUgcLookupService,
  ) {
    super();
  }

  /** Gets player UGC item. */
  public getUgcItem(id: string, ugcType: UgcType): Observable<PlayerUgcItem> {
    return this.woodstockService.getPlayerUgcItem$(id, ugcType);
  }

  /** Retrieve Photo thumnbnails. */
  public retrievePhotoThumbnails(ugcIds: GuidLikeString[]): Observable<LookupThumbnailsResult[]> {
    return this.woodstockUgcLookupService.GetPhotoThumbnails$(ugcIds);
  }
}
