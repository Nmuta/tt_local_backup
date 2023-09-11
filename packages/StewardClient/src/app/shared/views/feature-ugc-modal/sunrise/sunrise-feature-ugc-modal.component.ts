import { Component, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { GameTitle } from '@models/enums';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { UgcFeaturedStatus } from '@models/ugc-featured-status';
import { UgcType } from '@models/ugc-filters';
import { SunriseService } from '@services/sunrise';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { FeatureUgcModalBaseComponent } from '../feature-ugc-modal.component';

/** Sunrise modal to set featured status of a UGC item. */
@Component({
  templateUrl: '../feature-ugc-modal.component.html',
  styleUrls: ['../feature-ugc-modal.component.scss'],
})
export class SunriseFeatureUgcModalComponent extends FeatureUgcModalBaseComponent {
  public gameTitle = GameTitle.FH4;

  constructor(
    private sunriseService: SunriseService,
    protected dialogRef: MatDialogRef<SunriseFeatureUgcModalComponent>,
    @Inject(MAT_DIALOG_DATA) protected data: PlayerUgcItem,
  ) {
    super(dialogRef, data);
  }

  /** Sends out request to set featured status. */
  public changeFeaturedStatus$(
    itemId: string,
    isFeatured: boolean,
    expireDate?: DateTime,
    forceExpireDate?: DateTime,
  ): Observable<void> {
    const expireDuration = !!expireDate ? expireDate.diff(DateTime.local().startOf('day')) : null;
    const forceExpireDuration = !!forceExpireDate
      ? forceExpireDate.diff(DateTime.local().startOf('day'))
      : null;
    return this.sunriseService.setUgcItemFeatureStatus({
      itemId: itemId,
      isFeatured: isFeatured,
      featuredExpiry: expireDuration,
      forceFeaturedExpiry: forceExpireDuration,
    } as UgcFeaturedStatus);
  }

  /** Gets UGC item. */
  public getUgcItem$(itemId: string, type: UgcType): Observable<PlayerUgcItem> {
    return this.sunriseService.getPlayerUgcItem$(itemId, type);
  }
}
