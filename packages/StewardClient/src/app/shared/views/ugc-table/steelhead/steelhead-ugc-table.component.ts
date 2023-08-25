import { Component, OnChanges } from '@angular/core';
import { GameTitle } from '@models/enums';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { UgcTableBaseComponent } from '../ugc-table.component';
import { UgcType } from '@models/ugc-filters';
import { Observable, switchMap, throwError } from 'rxjs';
import { GuidLikeString } from '@models/extended-types';
import { LookupThumbnailsResult } from '@models/ugc-thumbnail-lookup';
import { SteelheadUgcLookupService } from '@services/api-v2/steelhead/ugc/lookup/steelhead-ugc-lookup.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BulkGenerateSharecodeResponse } from '@services/api-v2/woodstock/ugc/sharecode/woodstock-ugc-sharecode.service';
import { BulkReportUgcResponse } from '@services/api-v2/woodstock/ugc/report/woodstock-ugc-report.service';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { SteelheadUgcSharecodeService } from '@services/api-v2/steelhead/ugc/sharecode/steelhead-ugc-sharecode.service';
import { SteelheadUgcHideStatusService } from '@services/api-v2/steelhead/ugc/hide-status/steelhead-ugc-hide-status.service';

/** Displays steelhead UGC content in a table. */
@Component({
  selector: 'steelhead-ugc-table',
  templateUrl: '../ugc-table.component.html',
  styleUrls: ['../ugc-table.component.scss'],
})
export class SteelheadUgcTableComponent extends UgcTableBaseComponent implements OnChanges {
  public gameTitle = GameTitle.FM8;

  constructor(
    private readonly steelheadUgcLookupService: SteelheadUgcLookupService,
    private readonly steelheadUgcHideStatusService: SteelheadUgcHideStatusService,
    private readonly steelheadUgcSharecodeService: SteelheadUgcSharecodeService,
    private readonly backgroundJobService: BackgroundJobService,
    snackbar: MatSnackBar,
  ) {
    super(snackbar);
  }

  /** Gets player UGC item. */
  public getUgcItem(id: GuidLikeString, type: UgcType): Observable<PlayerUgcItem> {
    return this.steelheadUgcLookupService.getPlayerUgcItem$(id, type);
  }

  /** Retrieve Photo thumnbnails. */
  public retrievePhotoThumbnails(ugcIds: GuidLikeString[]): Observable<LookupThumbnailsResult[]> {
    return this.steelheadUgcLookupService.getUgcPhotoThumbnails$(ugcIds);
  }

  /** Hide multiple Ugcs. */
  public hideUgc(ugcIds: string[]): Observable<string[]> {
    return this.steelheadUgcHideStatusService.hideUgcItemsUsingBackgroundJob$(ugcIds).pipe(
      switchMap(response => {
        return this.backgroundJobService.waitForBackgroundJobToComplete<string[]>(response);
      }),
    );
  }

  /** Unhide multiple Ugcs. */
  public unhideUgc(ugcIds: string[]): Observable<string[]> {
    return this.steelheadUgcHideStatusService.unhideUgcItemsUsingBackgroundJob$(ugcIds).pipe(
      switchMap(response => {
        return this.backgroundJobService.waitForBackgroundJobToComplete<string[]>(response);
      }),
    );
  }

  /** Generate multiple Sharecodes. */
  public generateSharecodes(ugcIds: string[]): Observable<BulkGenerateSharecodeResponse[]> {
    return this.steelheadUgcSharecodeService.ugcGenerateSharecodesUsingBackgroundJob$(ugcIds).pipe(
      switchMap(response => {
        return this.backgroundJobService.waitForBackgroundJobToComplete<
          BulkGenerateSharecodeResponse[]
        >(response);
      }),
    );
  }

  /** Report multiple Ugcs. */
  public reportUgc(_ugcIds: string[], _reasonId: string): Observable<BulkReportUgcResponse[]> {
    return throwError(new Error('Steelhead does not support reporting ugc items.'));
  }
}
