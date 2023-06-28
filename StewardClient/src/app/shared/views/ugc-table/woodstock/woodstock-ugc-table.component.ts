import { Component, OnChanges } from '@angular/core';
import { GameTitle } from '@models/enums';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { UgcTableBaseComponent } from '../ugc-table.component';
import { UgcType } from '@models/ugc-filters';
import { Observable, switchMap } from 'rxjs';
import { WoodstockService } from '@services/woodstock';
import { WoodstockUgcLookupService } from '@services/api-v2/woodstock/ugc/lookup/woodstock-ugc-lookup.service';
import { GuidLikeString } from '@models/extended-types';
import { LookupThumbnailsResult } from '@models/ugc-thumbnail-lookup';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WoodstockUgcVisibilityService } from '@services/api-v2/woodstock/ugc/visibility/woodstock-ugc-visibility.service';
import {
  BulkGenerateSharecodeResponse,
  WoodstockUgcSharecodeService,
} from '@services/api-v2/woodstock/ugc/sharecode/woodstock-ugc-sharecode.service';

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
    private readonly woodstockUgcVisibilityService: WoodstockUgcVisibilityService,
    private readonly woodstockUgcSharecodeService: WoodstockUgcSharecodeService,
    private readonly backgroundJobService: BackgroundJobService,
    snackbar: MatSnackBar,
  ) {
    super(snackbar);
  }

  /** Gets player UGC item. */
  public getUgcItem(id: string, ugcType: UgcType): Observable<PlayerUgcItem> {
    return this.woodstockService.getPlayerUgcItem$(id, ugcType);
  }

  /** Retrieve Photo thumnbnails. */
  public retrievePhotoThumbnails(ugcIds: GuidLikeString[]): Observable<LookupThumbnailsResult[]> {
    return this.woodstockUgcLookupService.GetPhotoThumbnails$(ugcIds);
  }

  /** Hide multiple Ugcs. */
  public hideUgc(ugcIds: string[]): Observable<string[]> {
    return this.woodstockUgcVisibilityService.hideUgcItemsUsingBackgroundJob$(ugcIds).pipe(
      switchMap(response => {
        return this.backgroundJobService.waitForBackgroundJobToComplete<string[]>(response);
      }),
    );
  }

  /** Unhide multiple Ugcs. */
  public unhideUgc(ugcIds: string[]): Observable<string[]> {
    return this.woodstockUgcVisibilityService.unhideUgcItemsUsingBackgroundJob$(ugcIds).pipe(
      switchMap(response => {
        return this.backgroundJobService.waitForBackgroundJobToComplete<string[]>(response);
      }),
    );
  }

  /** Generate multiple Sharecodes. */
  public generateSharecodes(ugcIds: string[]): Observable<BulkGenerateSharecodeResponse[]> {
    return this.woodstockUgcSharecodeService.ugcGenerateSharecodesUsingBackgroundJob$(ugcIds).pipe(
      switchMap(response => {
        return this.backgroundJobService.waitForBackgroundJobToComplete<
          BulkGenerateSharecodeResponse[]
        >(response);
      }),
    );
  }
}
