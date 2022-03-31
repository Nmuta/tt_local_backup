import { Component, OnChanges } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { PlayerUGCItem } from '@models/player-ugc-item';
import { MatDialog } from '@angular/material/dialog';
import { SunriseFeatureUGCModalComponent } from '@views/feature-ugc-modal/sunrise/sunrise-feature-ugc-modal.component';
import { filter, takeUntil } from 'rxjs/operators';
import { PlayerUGCItemTableEntries, UGCTableBaseComponent } from '../ugc-table.component';
import { SunriseService } from '@services/sunrise';
import { UGCType } from '@models/ugc-filters';
import { Observable } from 'rxjs';
import { pull } from 'lodash';
import { renderGuard } from '@helpers/rxjs';

/** Displays sunrise UGC content in a table. */
@Component({
  selector: 'sunrise-ugc-table',
  templateUrl: '../ugc-table.component.html',
  styleUrls: ['../ugc-table.component.scss'],
})
export class SunriseUGCTableComponent extends UGCTableBaseComponent implements OnChanges {
  public gameTitle = GameTitleCodeName.FH4;

  constructor(protected dialog: MatDialog, private readonly sunriseService: SunriseService) {
    super();
  }

  /** Opens the feature UGC modal. */
  public openFeatureUGCModal(item: PlayerUGCItem): void {
    this.dialog
      .open(SunriseFeatureUGCModalComponent, {
        data: item,
      })
      .afterClosed()
      .pipe(
        filter(data => !!data),
        takeUntil(this.onDestroy$),
      )
      .subscribe((response: PlayerUGCItem) => {
        const updatedData = this.ugcTableDataSource.data;
        const itemToUpdateIndex = updatedData.findIndex(item => item.guidId === response.guidId);

        if (itemToUpdateIndex >= 0) {
          updatedData[itemToUpdateIndex] = response;
          this.ugcTableDataSource.data = updatedData;
        }
      });
  }

  /** Gets player UGC item. */
  public getUGCItem(id: string, type: UGCType): Observable<PlayerUGCItem> {
    return this.sunriseService.getPlayerUGCItem(id, type);
  }

  /** Hide UGC item. */
  public hideUGCItem(item: PlayerUGCItemTableEntries): void {
    item.monitor = item.monitor.repeat();

    this.sunriseService
      .hideUgc$(item.guidId)
      .pipe(item.monitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.deleteEntry(item);
      });
  }

  private deleteEntry(item: PlayerUGCItemTableEntries): void {
    renderGuard(() => {
      pull(this.ugcTableDataSource.data, item);
      pull(this.allMonitors, item.monitor);
      item.monitor.dispose();

      this.ugcTableDataSource._updateChangeSubscription();
    });
  }
}
