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
import { fromEvent, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '@components/base-component/base.component';
import { UgcType } from '@models/ugc-filters';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { GameTitle } from '@models/enums';
import { PermissionServiceTool, PermissionsService } from '@services/permissions';

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

  public ugcTableDataSource = new MatTableDataSource<PlayerUgcItemTableEntries>([]);
  public columnsToDisplay: string[] = UGC_TABLE_COLUMNS_TWO_IMAGES;
  public expandedElement: MatColumnDef;
  public useExpandoColumnDef: boolean = false;
  public expandoColumnDef = UGC_TABLE_COLUMNS_EXPANDO;
  public waitingForThumbnails = false;
  public allMonitors: ActionMonitor[] = [];
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
        dataSource[i].thumbnailOneImageBase64 = fullUgcItem.thumbnailOneImageBase64;
        dataSource[i].thumbnailTwoImageBase64 = fullUgcItem.thumbnailTwoImageBase64;
      }
    }

    this.ugcTableDataSource.data = dataSource;
    this.waitingForThumbnails = false;
  }

  /** Downloads the UGC Photo. */
  public downloadPhoto(item: PlayerUgcItem): void {
    const title = `${item.type}_${item.id}.jpg`;
    const linkSource = item.thumbnailOneImageBase64;
    const downloadLink = document.createElement('a');
    downloadLink.href = linkSource;
    downloadLink.download = title;
    downloadLink.click();
    downloadLink.remove();
  }

  private shouldLookupThumbnails(item: PlayerUgcItem): boolean {
    return !!item && item.type !== UgcType.Tune && !item.thumbnailOneImageBase64;
  }

  private shouldUseCondensedTableView(): boolean {
    return this.table?.nativeElement?.offsetWidth <= 1000;
  }
}
