import { Component, OnChanges } from '@angular/core';
import { GameTitle } from '@models/enums';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { PlayerUgcItemTableEntries, UgcTableBaseComponent } from '../ugc-table.component';
import { UgcType } from '@models/ugc-filters';
import { Observable } from 'rxjs';
import { PermissionsService } from '@services/permissions';
import { GuidLikeString } from '@models/extended-types';
import { LookupThumbnailsResult } from '@models/ugc-thumbnail-lookup';
import { SteelheadUgcLookupService } from '@services/api-v2/steelhead/ugc/lookup/steelhead-ugc-lookup.service';

/** Displays steelhead UGC content in a table. */
@Component({
  selector: 'steelhead-ugc-table',
  templateUrl: '../ugc-table.component.html',
  styleUrls: ['../ugc-table.component.scss'],
})
export class SteelheadUgcTableComponent extends UgcTableBaseComponent implements OnChanges {
  public gameTitle = GameTitle.FM8;
  public supportFeaturing: boolean = false;
  public supportHiding: boolean = false;

  constructor(
    private readonly steelheadUgcLookupService: SteelheadUgcLookupService,
    permissionsService: PermissionsService,
  ) {
    super(permissionsService);
  }

  /** Opens the feature UGC modal. */
  public openFeatureUgcModal(_item: PlayerUgcItem): void {
    throw new Error('Steelhead does not support featuring UGC');
  }

  /** Gets player UGC item. */
  public getUgcItem(id: GuidLikeString, type: UgcType): Observable<PlayerUgcItem> {
    return this.steelheadUgcLookupService.getPlayerUgcItem$(id, type);
  }

  /** Hides UGC item.  */
  public hideUgcItem(_item: PlayerUgcItemTableEntries): void {
    throw new Error('Steelhead does not support hiding UGC');
  }

  /** Retrieve Photo thumnbnails. */
  public retrievePhotoThumbnails(ugcIds: GuidLikeString[]): Observable<LookupThumbnailsResult[]> {
    return this.steelheadUgcLookupService.getUgcPhotoThumbnails$(ugcIds);
  }
}
