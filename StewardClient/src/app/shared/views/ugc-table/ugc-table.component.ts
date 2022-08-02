import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatColumnDef, MatTable, MatTableDataSource } from '@angular/material/table';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { state, style, trigger } from '@angular/animations';
import { EMPTY, from, fromEvent, Observable } from 'rxjs';
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
import { PermissionServiceTool, PermissionsService } from '@services/permissions';
import JSZip from 'jszip';
import { LookupThumbnailsResult } from '@models/ugc-thumbnail-lookup';
import { GuidLikeString } from '@models/extended-types';
import { saveAs } from 'file-saver';
import { chunk, cloneDeep, flatten } from 'lodash';

export const UGC_TABLE_COLUMNS_TWO_IMAGES: string[] = [
  'ugcInfo',
  'metadata',
  'stats',
  'thumbnailOneImageBase64',
  'thumbnailTwoImageBase64',
  'actions',
];

/** Extended type from HideableUgc. */
export type PlayerUgcItemTableEntries = PlayerUgcItem & {
  ugcDetailsLink?: string;
  monitor?: ActionMonitor;
};

export const UGC_TABLE_COLUMNS_EXPANDO = ['exando-ugcInfo', 'thumbnailOneImageBase64', 'actions'];

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
  @Input() content: PlayerUgcItem[];
  @Input() contentType: UgcType = UgcType.Unknown;
  public readonly THUMBNAIL_LOOKUP_BATCH_SIZE = 250;
  public readonly THUMBNAIL_LOOKUP_MAX_CONCURRENCY = 4;

  public ugcTableDataSource = new MatTableDataSource<PlayerUgcItemTableEntries>([]);
  public columnsToDisplay: string[] = UGC_TABLE_COLUMNS_TWO_IMAGES;
  public expandedElement: MatColumnDef;
  public useExpandoColumnDef: boolean = false;
  public expandoColumnDef = UGC_TABLE_COLUMNS_EXPANDO;
  public waitingForThumbnails = false;
  public displayTableWideActions: boolean = false;
  public ugcCount: number;
  public allMonitors: ActionMonitor[] = [];
  public downloadAllMonitor: ActionMonitor = new ActionMonitor('DOWNLOAD UGC Thumbnails');
  public ugcDetailsLinkSupported: boolean = true;
  public ugcType = UgcType;
  public canFeatureUgc: boolean = false;
  public canHideUgc: boolean = false;

  public readonly privateFeaturingDisabledTooltip =
    'Cannot change featured status of private UGC content.';
  public readonly invalidRoleDisabledTooltip = 'Action is disabled for your user role.';

  // Action availability
  public supportFeaturing: boolean = true;
  public supportHiding: boolean = true;

  public abstract gameTitle: GameTitle;

  constructor(private readonly permissionService: PermissionsService) {
    super();
  }

  /** Opens the feature UGC modal. */
  public abstract openFeatureUgcModal(item: PlayerUgcItem): void;
  public abstract getUgcItem(id: string, type: UgcType): Observable<PlayerUgcItem>;
  public abstract hideUgcItem(item: PlayerUgcItemTableEntries): void;
  public abstract retrievePhotoThumbnails(
    ugcIds: GuidLikeString[],
  ): Observable<LookupThumbnailsResult[]>;

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

    this.canFeatureUgc = this.permissionService.currentUserHasWritePermission(
      PermissionServiceTool.FeatureUgc,
    );
    this.canHideUgc = this.permissionService.currentUserHasWritePermission(
      PermissionServiceTool.HideUgc,
    );
  }

  /** Angular hook. */
  public ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.content) {
      const ugcItemsToProcess: PlayerUgcItemTableEntries[] = this.content;

      ugcItemsToProcess.forEach(item => {
        if (this.ugcDetailsLinkSupported) {
          item.ugcDetailsLink = `/app/tools/ugc-details/${this.gameTitle}/${
            item.id
          }/${item.type.toLowerCase()}`;
        }
        item.monitor = new ActionMonitor(`POST Hide UGC with ID: ${item.id}`);
        this.allMonitors.push(item.monitor);
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
        this.getUgcThumbnailsForActiveDataset();
      }
    }
  }

  /** Angular hook. */
  public ngAfterViewInit(): void {
    this.ugcTableDataSource.paginator = this.paginator;
  }

  /** Looks up thumbnails for items in the active paginated page. Ignores items with thumbnails already present. */
  public async getUgcThumbnailsForActiveDataset(): Promise<void> {
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
    const typesWithThumbnails = [UgcType.Livery, UgcType.Photo];
    const shouldLookupThumbnails = !!typesWithThumbnails.find(type => type === item?.type);
    return !!item && !item.thumbnailOneImageBase64 && shouldLookupThumbnails;
  }

  private shouldUseCondensedTableView(): boolean {
    return this.table?.nativeElement?.offsetWidth <= 1000;
  }
}
