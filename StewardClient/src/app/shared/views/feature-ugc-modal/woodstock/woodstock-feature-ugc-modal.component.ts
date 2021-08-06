import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GameTitleCodeName } from '@models/enums';
import { PlayerUGCItem } from '@models/player-ugc-item';
import { UGCFeaturedStatus } from '@models/ugc-featured-status';
import { UGCType } from '@models/ugc-filters';
import { WoodstockService } from '@services/woodstock';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { FeatureUGCModalBaseComponent } from '../feature-ugc-modal.component';

/** Woodstock modal to set featured status of a UGC item. */
@Component({
  templateUrl: '../feature-ugc-modal.component.html',
  styleUrls: ['../feature-ugc-modal.component.scss'],
})
export class WoodstockFeatureUGCModalComponent extends FeatureUGCModalBaseComponent {
  public gameTitle = GameTitleCodeName.FH5;

  constructor(
    private woodstockService: WoodstockService,
    protected dialogRef: MatDialogRef<WoodstockFeatureUGCModalComponent>,
    @Inject(MAT_DIALOG_DATA) protected data: PlayerUGCItem,
  ) {
    super(dialogRef, data);
  }

  /** Sets featured status of a UGC item. */
  public setFeaturedStatus$(itemId: string, expireDate: DateTime): Observable<void> {
    const expireDuration = expireDate.diff(DateTime.local().startOf('day'));
    return this.woodstockService.setUGCItemFeatureStatus({
      itemId: itemId,
      isFeatured: true,
      expiry: expireDuration,
    } as UGCFeaturedStatus);
  }

  /** Deletes featured status of a UGC item. */
  public deleteFeaturedStatus$(itemId: string): Observable<void> {
    return this.woodstockService.setUGCItemFeatureStatus({
      itemId: itemId,
      isFeatured: false,
    } as UGCFeaturedStatus);
  }

  /** Gets UGC item. */
  public getUGCItem$(itemId: string, type: UGCType): Observable<PlayerUGCItem> {
    return this.woodstockService.getPlayerUGCItem(itemId, type);
  }
}
