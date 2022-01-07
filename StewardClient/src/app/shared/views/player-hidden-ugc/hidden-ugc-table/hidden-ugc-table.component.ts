import { Component, Input, OnChanges } from '@angular/core';
import { BetterMatTableDataSource } from '@helpers/better-mat-table-data-source';
import { HideableUgc } from '@models/hideable-ugc.model';

/** Renders a player's hidden UGC. */
@Component({
  selector: 'hidden-ugc-table',
  templateUrl: './hidden-ugc-table.component.html',
  styleUrls: ['./hidden-ugc-table.component.scss'],
})
export class HiddenUgcTableComponent implements OnChanges {
  @Input() public hiddenUgc: HideableUgc[] = [];

  public displayedColumns = ['preview', 'info', 'times'];
  public dataSource: BetterMatTableDataSource<HideableUgc> =
    new BetterMatTableDataSource<HideableUgc>();

  /** Angular lifecycle hook. */
  public ngOnChanges(): void {
    this.dataSource = new BetterMatTableDataSource<HideableUgc>(this.hiddenUgc);
  }

  /** Type safety for UGC in the template. */
  public ugc(source: unknown): HideableUgc {
    return source as HideableUgc;
  }
}
