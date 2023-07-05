import { Component, OnChanges, OnInit } from '@angular/core';
import { GameTitle } from '@models/enums';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { UgcTableBaseComponent } from '../ugc-table.component';
import { UgcType } from '@models/ugc-filters';
import { Observable, switchMap, takeUntil } from 'rxjs';
import { WoodstockService } from '@services/woodstock';
import { WoodstockUgcLookupService } from '@services/api-v2/woodstock/ugc/lookup/woodstock-ugc-lookup.service';
import { GuidLikeString } from '@models/extended-types';
import { LookupThumbnailsResult } from '@models/ugc-thumbnail-lookup';
import { WoodstockUgcHideService } from '@services/api-v2/woodstock/ugc/hide/woodstock-ugc-hide.service';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  BulkGenerateSharecodeResponse,
  WoodstockUgcSharecodeService,
} from '@services/api-v2/woodstock/ugc/sharecode/woodstock-ugc-sharecode.service';
import { WoodstockUgcReportService } from '@services/api-v2/woodstock/ugc/report/woodstock-ugc-report.service';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { UgcReportReason } from '@models/ugc-report-reason';

/** Displays woodstock UGC content in a table. */
@Component({
  selector: 'woodstock-ugc-table',
  templateUrl: 'woodstock-ugc-table.component.html',
  styleUrls: ['../ugc-table.component.scss'],
})
export class WoodstockUgcTableComponent extends UgcTableBaseComponent implements OnChanges, OnInit {
  public gameTitle = GameTitle.FH5;
  public getReportReasonsMonitor: ActionMonitor = new ActionMonitor('GET Report Reasons');
  public reportReasons: UgcReportReason[] = null;

  constructor(
    private readonly woodstockService: WoodstockService,
    private readonly woodstockUgcLookupService: WoodstockUgcLookupService,
    private readonly woodstockUgcHideService: WoodstockUgcHideService,
    private readonly woodstockUgcReportService: WoodstockUgcReportService,
    private readonly woodstockUgcSharecodeService: WoodstockUgcSharecodeService,
    private readonly backgroundJobService: BackgroundJobService,
    snackbar: MatSnackBar,
  ) {
    super(snackbar);
  }

  /** Angular hook. */
  public ngOnInit(): void {
    super.ngOnInit();

    this.woodstockUgcReportService
      .getUgcReportReasons$()
      .pipe(this.getReportReasonsMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(results => {
        this.reportReasons = results;
      });
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
    return this.woodstockUgcHideService.hideUgcItemsUsingBackgroundJob$(ugcIds).pipe(
      switchMap(response => {
        return this.backgroundJobService.waitForBackgroundJobToComplete<string[]>(response);
      }),
    );
  }

  /** Report multiple Ugcs. */
  public reportUgc(ugcIds: string[], reasonId: string): Observable<string[]> {
    return this.woodstockUgcReportService.reportUgcItemsUsingBackgroundJob$(ugcIds, reasonId).pipe(
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
