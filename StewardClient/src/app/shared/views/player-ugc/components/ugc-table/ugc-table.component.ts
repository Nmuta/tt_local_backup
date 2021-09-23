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
import { PlayerUGCItem } from '@models/player-ugc-item';
import { state, style, trigger } from '@angular/animations';
import { fromEvent, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '@components/base-component/base.component';
import { UGCType } from '@models/ugc-filters';

export const UGC_TABLE_COLUMNS_TWO_IMAGES: string[] = [
  'ugcInfo',
  'metadata',
  'stats',
  'thumbnailImageOneBase64',
  'thumbnailImageTwoBase64',
  'actions',
];

export const UGC_TABLE_COLUMNS_EXPANDO = ['exando-ugcInfo', 'thumbnailImageOneBase64', 'actions'];

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
export abstract class UGCTableBaseComponent
  extends BaseComponent
  implements OnInit, OnChanges, AfterViewInit {
  @ViewChild(MatTable, { read: ElementRef }) table: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() content: PlayerUGCItem[];

  public ugcTableDataSource = new MatTableDataSource<PlayerUGCItem>([]);
  public columnsToDisplay: string[] = UGC_TABLE_COLUMNS_TWO_IMAGES;
  public expandedElement: MatColumnDef;
  public useExpandoColumnDef: boolean = false;
  public expandoColumnDef = UGC_TABLE_COLUMNS_EXPANDO;
  public waitingForThumbnails = false;

  /** Opens the feature UGC modal. */
  public abstract openFeatureUGCModal(item: PlayerUGCItem): void;
  public abstract getUGCItem(id: string, type: UGCType): Observable<PlayerUGCItem>;

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
  }

  /** Angular hook. */
  public ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.content) {
      this.ugcTableDataSource.data = this.content;

      if (this.paginator) {
        this.paginator.pageIndex = 0;
      }

      // Check paginator for page length and get thumbnails for first 'X' amount of content
      if (this.ugcTableDataSource.data.length > 0) {
        this.getUGCThumbnailsForActiveDataset();
      }
    }
  }

  /** Angular hook. */
  public ngAfterViewInit(): void {
    this.ugcTableDataSource.paginator = this.paginator;
  }

  /** Looks up thumbnails for items in the active paginated page. Ignores items with thumbnails already present. */
  public async getUGCThumbnailsForActiveDataset(): Promise<void> {
    const activeLength = this.paginator.pageSize;
    const activeIndex = this.paginator.pageIndex * activeLength;
    const dataSource = this.ugcTableDataSource.data;
    this.waitingForThumbnails = true;

    for (let i = activeIndex; i < activeIndex + activeLength; i++) {
      const ugcItem = dataSource[i];
      if (this.shouldLookupThumbnails(ugcItem)) {
        const fullUGCItem = await this.getUGCItem(ugcItem.guidId, ugcItem.type).toPromise();
        dataSource[i].thumbnailImageOneBase64 = fullUGCItem.thumbnailImageOneBase64;
        dataSource[i].thumbnailImageTwoBase64 = fullUGCItem.thumbnailImageTwoBase64;
      }
    }

    this.ugcTableDataSource.data = dataSource;
    this.waitingForThumbnails = false;
  }

  private shouldLookupThumbnails(item: PlayerUGCItem): boolean {
    return !!item && item.type !== UGCType.Tune && !item.thumbnailImageOneBase64;
  }

  private shouldUseCondensedTableView(): boolean {
    return this.table?.nativeElement?.offsetWidth <= 1000;
  }
}
