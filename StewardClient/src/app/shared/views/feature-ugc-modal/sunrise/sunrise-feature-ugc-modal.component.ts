import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GameTitleCodeName } from '@models/enums';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { UgcFeaturedStatus } from '@models/ugc-featured-status';
import { UgcType } from '@models/ugc-filters';
import { SunriseService } from '@services/sunrise';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { FeatureUGCModalBaseComponent } from '../feature-ugc-modal.component';

/** Sunrise modal to set featured status of a UGC item. */
@Component({
  templateUrl: '../feature-ugc-modal.component.html',
  styleUrls: ['../feature-ugc-modal.component.scss'],
})
export class SunriseFeatureUGCModalComponent extends FeatureUGCModalBaseComponent {
  public gameTitle = GameTitleCodeName.FH4;

  constructor(
    private sunriseService: SunriseService,
    protected dialogRef: MatDialogRef<SunriseFeatureUGCModalComponent>,
    @Inject(MAT_DIALOG_DATA) protected data: PlayerUgcItem,
  ) {
    super(dialogRef, data);
  }

  /** Sends out request to set featured status. */
  public setFeaturedStatus$(itemId: string, expireDate: DateTime): Observable<void> {
    const expireDuration = expireDate.diff(DateTime.local().startOf('day'));
    return this.sunriseService.setUgcItemFeatureStatus({
      itemId: itemId,
      isFeatured: true,
      expiry: expireDuration,
    } as UgcFeaturedStatus);
  }

  /** Deletes featured status of a UGC item. */
  public deleteFeaturedStatus$(itemId: string): Observable<void> {
    return this.sunriseService.setUgcItemFeatureStatus({
      itemId: itemId,
      isFeatured: false,
    } as UgcFeaturedStatus);
  }

  /** Gets UGC item. */
  public getUGCItem$(itemId: string, type: UgcType): Observable<PlayerUgcItem> {
    return this.sunriseService.getPlayerUgcItem(itemId, type);
  }
}
