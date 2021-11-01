import { Component, Input, OnChanges } from '@angular/core';
import { BetterMatTableDataSource } from '@helpers/better-mat-table-data-source';
import { SunriseHideableUgc } from '@models/sunrise/sunrise-hideable-ugc.model';

/** Renders a player's hidden UGC. */
@Component({
  selector: 'hidden-ugc-table',
  templateUrl: './hidden-ugc-table.component.html',
  styleUrls: ['./hidden-ugc-table.component.scss'],
})
export class HiddenUgcTableComponent implements OnChanges {
  @Input() public hiddenUgc: SunriseHideableUgc[] = [];

  public displayedColumns = ['preview', 'info', 'time'];
  public dataSource: BetterMatTableDataSource<SunriseHideableUgc> = new BetterMatTableDataSource<
    SunriseHideableUgc
  >();

  /** Angular lifecycle hook. */
  public ngOnChanges(): void {
    this.dataSource = new BetterMatTableDataSource<SunriseHideableUgc>(this.hiddenUgc);
  }

  /** Type safety for UGC in the template. */
  public ugc(source: unknown): SunriseHideableUgc {
    return source as SunriseHideableUgc;
  }
}
