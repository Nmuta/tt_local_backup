import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import {
  MatLegacyColumnDef as MatColumnDef,
  MatLegacyTable as MatTable,
  MatLegacyTableDataSource as MatTableDataSource,
} from '@angular/material/legacy-table';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { state, style, trigger } from '@angular/animations';
import { EMPTY, from, fromEvent, Observable, of, throwError } from 'rxjs';
import {
  catchError,
  map as rxjsMap,
  mergeAll,
  switchMap,
  takeUntil,
  tap,
  toArray,
} from 'rxjs/operators';
import { BaseComponent } from '@components/base-component/base.component';
import { UgcType } from '@models/ugc-filters';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { GameTitle } from '@models/enums';
import JSZip from 'jszip';
import { LookupThumbnailsResult } from '@models/ugc-thumbnail-lookup';
import { GuidLikeString } from '@models/extended-types';
import { saveAs } from 'file-saver';
import { chunk, cloneDeep, flatten } from 'lodash';
import { getGiftRoute, getUgcDetailsRoute } from '@helpers/route-links';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { BetterSimpleChanges } from '@helpers/simple-changes';
import { BulkGenerateSharecodeResponse } from '@services/api-v2/woodstock/ugc/sharecode/woodstock-ugc-sharecode.service';
import { UgcReportReason } from '@models/ugc-report-reason';
import { BulkReportUgcResponse } from '@services/api-v2/woodstock/ugc/report/woodstock-ugc-report.service';

export const UGC_TABLE_COLUMNS_TWO_IMAGES: string[] = [
  'ugcInfo',
  'metadata',
  'stats',
  'thumbnailOneImageBase64',
  'thumbnailTwoImageBase64',
  'actions',
];

/** Extended type from PlayerUgcItem. */
export type PlayerUgcItemTableEntries = PlayerUgcItem & {
  /** Link to the ugc detail page of that specific ugc item */
  ugcDetailsLink?: string[];
  /** Sets if the row is selected */
  selected?: boolean;
};

export const UGC_TABLE_COLUMNS_EXPANDO = [
  'expandButton',
  'exando-ugcInfo',
  'thumbnailOneImageBase64',
  'actions',
];

/** A component for a UGC content table. */
@Component({
  template: '',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
    ]),
  ],
})
export abstract class UgcTableBaseComponent
  extends BaseComponent
  implements OnInit, OnChanges, AfterViewInit
{
  @ViewChild(MatTable, { read: ElementRef }) table: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  /** Player UGC items. */
  @Input() content: PlayerUgcItem[];
  /** Content type of the UGC shown. Default to {@link UgcType.Unknown}. */
  @Input() contentType: UgcType = UgcType.Unknown;
  /** Whether the content of the table is hidden or not. */
  @Input() isContentHidden: boolean = false;
  /** Output when UGC items are hidden. */
  @Output() ugcItemsRemoved = new EventEmitter<string[]>();

  public readonly THUMBNAIL_LOOKUP_BATCH_SIZE = 250;
  public readonly THUMBNAIL_LOOKUP_MAX_CONCURRENCY = 4;

  public ugcTableDataSource = new MatTableDataSource<PlayerUgcItemTableEntries>([]);
  public columnsToDisplay: string[] = UGC_TABLE_COLUMNS_TWO_IMAGES;
  public expandedElement: MatColumnDef;
  public useExpandoColumnDef: boolean = false;
  public expandoColumnDef = UGC_TABLE_COLUMNS_EXPANDO;
  public waitingForThumbnails = false;
  public displayTableWideActions: boolean = false;
  public isBulkReportSupported: boolean = false;
  public ugcCount: number;
  public allMonitors: ActionMonitor[] = [];
  public downloadAllMonitor: ActionMonitor = new ActionMonitor('DOWNLOAD UGC Thumbnails');
  public hideUgcMonitor: ActionMonitor = new ActionMonitor('Hide Ugc');
  public unhideUgcMonitor: ActionMonitor = new ActionMonitor('Unhide Ugc');
  public reportUgcMonitor: ActionMonitor = new ActionMonitor('Report Ugc');
  public generateSharecodesMonitor: ActionMonitor = new ActionMonitor('Generate Sharecode(s)');
  public getReportReasonsMonitor: ActionMonitor = new ActionMonitor('GET Report Reasons');
  public ugcDetailsLinkSupported: boolean = true;
  public ugcHidingSupported: boolean = true;
  public ugcType = UgcType;
  public liveryGiftingRoute: string[];
  public selectedUgcs: PlayerUgcItemTableEntries[] = [];
  public selectedPrivateUgcCount: number = 0;
  public ugcsWithoutSharecodes: PlayerUgcItemTableEntries[] = [];
  public reportReasons: UgcReportReason[] = null;
  public reasonId: string = null;

  public readonly privateFeaturingDisabledTooltip =
    'Cannot change featured status of private UGC content.';
  public readonly invalidRoleDisabledTooltip = 'Action is disabled for your user role.';
  public readonly hideUgcPermission = PermAttributeName.HideUgc;
  public readonly unhideUgcPermission = PermAttributeName.UnhideUgc;
  public readonly bulkGenerateSharecodePermission = PermAttributeName.BulkGenerateSharecode;

  public abstract gameTitle: GameTitle;

  constructor(private readonly snackbar: MatSnackBar) {
    super();
  }

  /** Opens the feature UGC modal. */
  public abstract getUgcItem(id: string, type: UgcType): Observable<PlayerUgcItem>;
  public abstract retrievePhotoThumbnails(
    ugcIds: GuidLikeString[],
  ): Observable<LookupThumbnailsResult[]>;
  public abstract hideUgc(ugcIds: string[]): Observable<string[]>;
  public abstract reportUgc(
    ugcIds: string[],
    reasonId: string,
  ): Observable<BulkReportUgcResponse[]>;
  public abstract unhideUgc(ugcIds: string[]): Observable<string[]>;
  public abstract generateSharecodes(ugcIds: string[]): Observable<BulkGenerateSharecodeResponse[]>;

  /** Angular hook. */
  public ngOnInit(): void {
    this.useExpandoColumnDef = this.shouldUseCondensedTableView();
    // We have a condensed table view for when content becomes too "squished".
    // This observable watches for resize events to switch views.
    fromEvent(window, 'resize')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(_event => {
        this.useExpandoColumnDef = this.shouldUseCondensedTableView();
      });

    this.liveryGiftingRoute = getGiftRoute(this.gameTitle);
  }

  /** Angular hook. */
  public ngOnChanges(changes: BetterSimpleChanges<UgcTableBaseComponent>): void {
    if (!!changes.content) {
      const ugcItemsToProcess: PlayerUgcItemTableEntries[] = this.content;
      this.ugcsWithoutSharecodes = [];

      ugcItemsToProcess.forEach(item => {
        if (this.ugcDetailsLinkSupported) {
          item.ugcDetailsLink = getUgcDetailsRoute(this.gameTitle, item.id, item.type);
        }

        if (!item.shareCode || item.shareCode == '') {
          this.ugcsWithoutSharecodes.push(item);
        }
      });

      this.ugcTableDataSource.data = ugcItemsToProcess;
      this.ugcCount = this.ugcTableDataSource.data.length;
      this.displayTableWideActions =
        this.gameTitle === GameTitle.FH5 && this.contentType === UgcType.Photo && this.ugcCount > 0;

      if (this.paginator) {
        this.paginator.pageIndex = 0;
      }

      // Check paginator for page length and get thumbnails for first 'X' amount of content
      if (this.ugcTableDataSource.data.length > 0) {
        this.getExtraDataForActiveDataset();
      }
    }
  }

  /** Angular hook. */
  public ngAfterViewInit(): void {
    this.ugcTableDataSource.paginator = this.paginator;
  }

  /** Looks up extra data for items in the active paginated page. Ignores items with extra data already present. */
  public async getExtraDataForActiveDataset(): Promise<void> {
    const activeLength = this.paginator.pageSize;
    const activeIndex = this.paginator.pageIndex * activeLength;
    const dataSource = this.ugcTableDataSource.data;
    this.waitingForThumbnails = true;

    for (let i = activeIndex; i < activeIndex + activeLength; i++) {
      const ugcItem = dataSource[i];
      if (this.shouldLookupThumbnails(ugcItem)) {
        const fullUgcItem = await this.getUgcItem(ugcItem.id, ugcItem.type).toPromise();
        // Deep clone so object is considered new within NgOnChanges
        dataSource[i] = cloneDeep(dataSource[i]);
        dataSource[i].thumbnailOneImageBase64 = fullUgcItem.thumbnailOneImageBase64;
        dataSource[i].thumbnailTwoImageBase64 = fullUgcItem.thumbnailTwoImageBase64;
        dataSource[i].liveryDownloadDataBase64 = fullUgcItem.liveryDownloadDataBase64;
      }
      if (this.shouldLookupTuneBlobData(ugcItem)) {
        const tuneBlobData = await this.getUgcItem(ugcItem.id, ugcItem.type).toPromise();
        // Deep clone so object is considered new within NgOnChanges
        dataSource[i] = cloneDeep(dataSource[i]);
        dataSource[i].tuneBlobDownloadDataBase64 = tuneBlobData.tuneBlobDownloadDataBase64;
      }
    }

    this.ugcTableDataSource.data = dataSource;
    this.waitingForThumbnails = false;
  }

  /** Downloads the UGC Photo. */
  public downloadPhotosInZip(): void {
    const zip = new JSZip();
    const photoIds = this.content.map(x => x.id);
    this.downloadAllMonitor = this.downloadAllMonitor.repeat();

    // For now we will only download the top 500 results.
    this.lookupThumbnails(photoIds.slice(0, 500))
      .pipe(
        tap(thumbnailLookupResults => {
          this.content.slice(0, 500).forEach(item => {
            const title = `${item.type}_${item.id}.jpg`;
            const thumbnail: string = thumbnailLookupResults
              .find(ugc => ugc.id === item.id)
              .thumbnail.split(',')[1];

            if (item.type !== UgcType.Photo) {
              return;
            }

            zip.file(title, thumbnail, { base64: true });
          });
        }),
        switchMap(() => {
          return from(zip.generateAsync({ type: 'blob' }));
        }),
        this.downloadAllMonitor.monitorSingleFire(),
        takeUntil(this.onDestroy$),
      )
      .subscribe(base64Content => {
        saveAs(base64Content, 'Photos.zip');
      });
  }

  /** Logic when row is selected. */
  public onRowSelected(ugc: PlayerUgcItemTableEntries): void {
    ugc.selected = !ugc.selected;

    if (ugc.selected) {
      this.selectedUgcs.push(ugc);
    } else {
      const selectedUgcIndex = this.selectedUgcs.findIndex(s => s.id === ugc.id);
      if (selectedUgcIndex >= 0) {
        this.selectedUgcs.splice(selectedUgcIndex, 1);
      }
    }

    this.selectedPrivateUgcCount = this.selectedUgcs.filter(ugc => !ugc.isPublic)?.length;
  }

  /** Hide multiple ugc items. */
  public hideMultipleUgc(ugcs: PlayerUgcItemTableEntries[]): void {
    this.hideUgcMonitor = this.hideUgcMonitor.repeat();
    // Private UGC can't be hidden by design.
    const ugcIds = ugcs.filter(ugc => ugc.isPublic).map(ugc => ugc.id);
    this.hideUgc(ugcIds)
      .pipe(
        switchMap(failedSharecodes => {
          if (failedSharecodes.length > 0) {
            // Remove ugcId that failed from the list of ugcIds
            failedSharecodes.forEach(failedUgc => {
              const index = ugcIds.indexOf(failedUgc);
              ugcIds.splice(index, 1);
            });

            this.removeUgcFromTable(ugcIds);

            return throwError(
              () => `Failed to hide the following UGC items : ${failedSharecodes.join('\n')}`,
            );
          }
          return of(failedSharecodes);
        }),
        this.hideUgcMonitor.monitorSingleFire(),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => {
        this.removeUgcFromTable(ugcIds);
      });
  }

  /** Unhide multiple ugc items. */
  public unhideMultipleUgc(ugcs: PlayerUgcItemTableEntries[]): void {
    this.unhideUgcMonitor = this.unhideUgcMonitor.repeat();

    const ugcIds = ugcs.map(ugc => ugc.id);
    this.unhideUgc(ugcIds)
      .pipe(
        switchMap(failedSharecodes => {
          if (failedSharecodes.length > 0) {
            // Remove ugcId that failed from the list of ugcIds
            failedSharecodes.forEach(failedUgc => {
              const index = ugcIds.indexOf(failedUgc);
              ugcIds.splice(index, 1);
            });

            this.removeUgcFromTable(ugcIds);

            return throwError(
              () => `Failed to unhide the following UGC items : ${failedSharecodes.join('\n')}`,
            );
          }
          return of(failedSharecodes);
        }),
        this.unhideUgcMonitor.monitorSingleFire(),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => {
        this.removeUgcFromTable(ugcIds);
      });
  }

  /** Report multiple ugc items. */
  public reportMultipleUgc(ugcs: PlayerUgcItemTableEntries[], reasonId: string): void {
    if (!ugcs || !reasonId) {
      return;
    }

    this.reportUgcMonitor = this.reportUgcMonitor.repeat();

    const ugcIds = ugcs.map(ugc => ugc.id);
    this.reportUgc(ugcIds, reasonId)
      .pipe(
        switchMap(ugcResponse => {
          const failedReports = ugcResponse.filter(response => !!response.error);
          if (failedReports.length > 0) {
            this.reportMultipleUgcFinished();

            return throwError(
              () =>
                `Failed to report some or all of the following UGC items : ${failedReports
                  .map(ugc => ugc.ugcId)
                  .join('\n')}`,
            );
          }
          return of(ugcResponse);
        }),
        this.reportUgcMonitor.monitorSingleFire(),
        takeUntil(this.onDestroy$),
      )
      .subscribe(_ugcResponse => {
        this.reportMultipleUgcFinished();
      });
  }

  /** Generates share codes for public UGC search results that don't have one. */
  public generateMissingSharecodes(ugcs: PlayerUgcItemTableEntries[]): void {
    this.generateSharecodesMonitor = this.generateSharecodesMonitor.repeat();

    const ugcIds = ugcs.map(ugc => ugc.id);

    this.generateSharecodes(ugcIds)
      .pipe(
        switchMap(ugcResponse => {
          const failedSharecodes = ugcResponse.filter(response => !!response.error);
          if (failedSharecodes.length > 0) {
            return throwError(
              () =>
                `Failed to generate Share Codes for some or all of the following UGC items : ${failedSharecodes
                  .map(ugc => ugc.ugcId)
                  .join('\n')}`,
            );
          }
          return of(ugcResponse);
        }),
        this.generateSharecodesMonitor.monitorSingleFire(),
        takeUntil(this.onDestroy$),
      )
      .subscribe(ugcResponse => {
        const successes = ugcResponse.filter(response => !!response.sharecode);

        // Update UGC items to add newly generated sharecodes
        // The ugcTableDataSource data property is a reference to this.content
        successes.forEach(response => {
          const index = this.content.findIndex(x => x.id == response.ugcId);
          this.content[index].shareCode = response.sharecode;
        });

        this.ugcsWithoutSharecodes = this.ugcsWithoutSharecodes.filter(
          x => !successes.find(y => y.ugcId === x.id),
        );

        this.ugcTableDataSource._updateChangeSubscription();
      });
  }

  /** Unselects all selected ugc items. */
  public unselectAllUgcItems(): void {
    this.selectedUgcs = [];
    this.selectedPrivateUgcCount = 0;
    this.ugcTableDataSource.data.map(s => (s.selected = false));
  }

  private lookupThumbnails(photoIds: string[]): Observable<LookupThumbnailsResult[]> {
    const batchedQueries: Observable<LookupThumbnailsResult[]>[] = [];

    // Generate batches of thumbnail queries to not overload the LSP
    chunk(photoIds, this.THUMBNAIL_LOOKUP_BATCH_SIZE).forEach(batch => {
      const query = this.retrievePhotoThumbnails(batch).pipe(
        catchError(() => {
          return EMPTY;
        }),
        takeUntil(this.onDestroy$),
      );

      batchedQueries.push(query);
    });

    return from(batchedQueries).pipe(
      mergeAll(this.THUMBNAIL_LOOKUP_MAX_CONCURRENCY), // Set max concurrency for requesting thumbnails
      toArray(), // Wait for all requests to complete
      rxjsMap((results: LookupThumbnailsResult[][]) => {
        const flatResults = flatten(results);
        const thumbnailResults = flatResults.map(thumbnailResult => {
          const finalResult = thumbnailResult as LookupThumbnailsResult;
          return finalResult;
        });

        return thumbnailResults;
      }),
      takeUntil(this.onDestroy$),
    );
  }

  private shouldLookupThumbnails(item: PlayerUgcItem): boolean {
    const typesWithThumbnails = [UgcType.Livery, UgcType.Photo, UgcType.LayerGroup];
    const shouldLookupThumbnails = !!typesWithThumbnails.find(type => type === item?.type);
    return !!item && !item.thumbnailOneImageBase64 && shouldLookupThumbnails;
  }

  private shouldLookupTuneBlobData(item: PlayerUgcItem): boolean {
    const shouldLookupTuneBlobData = item?.type == UgcType.TuneBlob;
    return !!item && !item.tuneBlobDownloadDataBase64 && shouldLookupTuneBlobData;
  }

  private shouldUseCondensedTableView(): boolean {
    return this.table?.nativeElement?.offsetWidth <= 1000;
  }

  private reportMultipleUgcFinished() {
    // We don't currently hide items after they're reported
    // so we'll just deselect everything after reporting
    this.selectedUgcs = [];
    this.selectedPrivateUgcCount = 0;
    this.ugcTableDataSource.data.forEach(ugcTableElement => {
      ugcTableElement.selected = false;
    });
    this.ugcTableDataSource._updateChangeSubscription();
  }

  private removeUgcFromTable(ugcIds: string[]) {
    // Remove hidden ugcs from the table
    // The ugcTableDataSource data property is a reference to this.content
    ugcIds.forEach(ugcId => {
      const index = this.content.findIndex(x => x.id == ugcId);
      this.content.splice(index, 1);
    });
    // Send ugcIds to be removed to parent component
    this.ugcItemsRemoved.emit(ugcIds);
    this.selectedUgcs = [];
    this.selectedPrivateUgcCount = 0;
    this.ugcTableDataSource.data.forEach(ugcTableElement => {
      ugcTableElement.selected = false;
    });
    this.ugcTableDataSource._updateChangeSubscription();
  }
}
