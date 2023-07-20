import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GameTitle } from '@models/enums';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { UgcFeaturedStatus } from '@models/ugc-featured-status';
import { UgcType } from '@models/ugc-filters';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { FeatureUgcModalBaseComponent } from '../feature-ugc-modal.component';
import { SteelheadUgcLookupService } from '@services/api-v2/steelhead/ugc/lookup/steelhead-ugc-lookup.service';
import { SteelheadUgcFeaturedStatusService } from '@services/api-v2/steelhead/ugc/featured-status/steelhead-ugc-featured-status.service';

/** Steelhead modal to set featured status of a UGC item. */
@Component({
  templateUrl: '../feature-ugc-modal.component.html',
  styleUrls: ['../feature-ugc-modal.component.scss'],
})
export class SteelheadFeatureUgcModalComponent extends FeatureUgcModalBaseComponent {
  public gameTitle = GameTitle.FM8;

  constructor(
    private steelheadUgcLookupService: SteelheadUgcLookupService,
    private steelheadUgcFeaturedStatusService: SteelheadUgcFeaturedStatusService,
    protected dialogRef: MatDialogRef<SteelheadFeatureUgcModalComponent>,
    @Inject(MAT_DIALOG_DATA) protected data: PlayerUgcItem,
  ) {
    super(dialogRef, data);
  }

  /** Sets featured status of a UGC item. */
  public changeFeaturedStatus$(
    itemId: string,
    isFeatured: boolean,
    expireDate?: DateTime,
  ): Observable<void> {
    const expireDuration = !!expireDate ? expireDate.diff(DateTime.local().startOf('day')) : null;
    return this.steelheadUgcFeaturedStatusService.setUgcItemFeatureStatus$({
      itemId: itemId,
      isFeatured: isFeatured,
      featuredExpiry: expireDuration,
    } as UgcFeaturedStatus);
  }

  /** Gets UGC item. */
  public getUgcItem$(itemId: string, type: UgcType): Observable<PlayerUgcItem> {
    return this.steelheadUgcLookupService.getPlayerUgcItem$(itemId, type);
  }
}
