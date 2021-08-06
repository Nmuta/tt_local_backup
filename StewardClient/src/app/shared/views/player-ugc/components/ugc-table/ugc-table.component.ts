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
import { fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '@components/base-component/base.component';
import { UGCType } from '@models/ugc-filters';

export const UGC_TABLE_COLUMNS_ONE_IMAGE: string[] = [
  'ugcInfo',
  'metadata',
  'stats',
  'thumbnailImageOneBase64',
  'actions',
];

export const UGC_TABLE_COLUMNS_TWO_IMAGE: string[] = [
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
  @Input() type: UGCType;

  public ugcTableDataSource = new MatTableDataSource<PlayerUGCItem>([]);
  public columnsToDisplay: string[];
  public expandedElement: MatColumnDef;
  public useExpandoColumnDef: boolean = false;
  public expandoColumnDef = UGC_TABLE_COLUMNS_EXPANDO;

  /** Opens the feature UGC modal. */
  public abstract openFeatureUGCModal(item: PlayerUGCItem): void;

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
    }

    if (!!changes.type) {
      this.columnsToDisplay =
        this.type === UGCType.Livery ? UGC_TABLE_COLUMNS_TWO_IMAGE : UGC_TABLE_COLUMNS_ONE_IMAGE;
    }
  }

  /** Angular hook. */
  public ngAfterViewInit(): void {
    this.ugcTableDataSource.paginator = this.paginator;
  }

  private shouldUseCondensedTableView(): boolean {
    return this.table?.nativeElement?.offsetWidth <= 1000;
  }
}
