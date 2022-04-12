import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GameTitleCodeName } from '@models/enums';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { UgcFeaturedStatus } from '@models/ugc-featured-status';
import { UgcType } from '@models/ugc-filters';
import { WoodstockService } from '@services/woodstock';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { FeatureUgcModalBaseComponent } from '../feature-ugc-modal.component';

/** Woodstock modal to set featured status of a UGC item. */
@Component({
  templateUrl: '../feature-ugc-modal.component.html',
  styleUrls: ['../feature-ugc-modal.component.scss'],
})
export class WoodstockFeatureUgcModalComponent extends FeatureUgcModalBaseComponent {
  public gameTitle = GameTitleCodeName.FH5;

  constructor(
    private woodstockService: WoodstockService,
    protected dialogRef: MatDialogRef<WoodstockFeatureUgcModalComponent>,
    @Inject(MAT_DIALOG_DATA) protected data: PlayerUgcItem,
  ) {
    super(dialogRef, data);
  }

  /** Sets featured status of a UGC item. */
  public setFeaturedStatus$(itemId: string, expireDate: DateTime): Observable<void> {
    const expireDuration = expireDate.diff(DateTime.local().startOf('day'));
    return this.woodstockService.setUgcItemFeatureStatus({
      itemId: itemId,
      isFeatured: true,
      expiry: expireDuration,
    } as UgcFeaturedStatus);
  }

  /** Deletes featured status of a UGC item. */
  public deleteFeaturedStatus$(itemId: string): Observable<void> {
    return this.woodstockService.setUgcItemFeatureStatus({
      itemId: itemId,
      isFeatured: false,
    } as UgcFeaturedStatus);
  }

  /** Gets UGC item. */
  public getUgcItem$(itemId: string, type: UgcType): Observable<PlayerUgcItem> {
    return this.woodstockService.getPlayerUgcItem(itemId, type);
  }
}
