import { Component, OnChanges } from '@angular/core';
import { GameTitle } from '@models/enums';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { UgcTableBaseComponent } from '../ugc-table.component';
import { SunriseService } from '@services/sunrise';
import { UgcType } from '@models/ugc-filters';
import { Observable, switchMap, throwError } from 'rxjs';
import { LookupThumbnailsResult } from '@models/ugc-thumbnail-lookup';
import { GuidLikeString } from '@models/extended-types';
import { SunriseUgcHideService } from '@services/api-v2/sunrise/ugc/hide/sunrise-ugc-hide.service';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { MatSnackBar } from '@angular/material/snack-bar';

/** Displays sunrise UGC content in a table. */
@Component({
  selector: 'sunrise-ugc-table',
  templateUrl: '../ugc-table.component.html',
  styleUrls: ['../ugc-table.component.scss'],
})
export class SunriseUgcTableComponent extends UgcTableBaseComponent implements OnChanges {
  public gameTitle = GameTitle.FH4;

  constructor(
    private readonly sunriseService: SunriseService,
    private readonly sunriseUgcHideService: SunriseUgcHideService,
    private readonly backgroundJobService: BackgroundJobService,
    snackbar: MatSnackBar,
  ) {
    super(snackbar);
  }

  /** Gets player UGC item. */
  public getUgcItem(id: string, type: UgcType): Observable<PlayerUgcItem> {
    return this.sunriseService.getPlayerUgcItem$(id, type);
  }

  /** Retrieve Photo thumnbnails. */
  public retrievePhotoThumbnails(_ugcIds: GuidLikeString[]): Observable<LookupThumbnailsResult[]> {
    return throwError(new Error('Sunrise does not support bulk photo thumbnail lookup.'));
  }

  /** Hide multiple Ugcs. */
  public hideUgc(ugcIds: string[]): Observable<string[]> {
    return this.sunriseUgcHideService.hideUgcItemsUsingBackgroundJob$(ugcIds).pipe(
      switchMap(response => {
        return this.backgroundJobService.waitForBackgroundJobToComplete<string[]>(response);
      }),
    );
  }
}
