import { Component, OnChanges } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { PlayerUGCItem } from '@models/player-ugc-item';
import { MatDialog } from '@angular/material/dialog';
import { WoodstockFeatureUGCModalComponent } from '@views/feature-ugc-modal/woodstock/woodstock-feature-ugc-modal.component';
import { filter, takeUntil } from 'rxjs/operators';
import { PlayerUGCItemTableEntries, UGCTableBaseComponent } from '../ugc-table.component';
import { UGCType } from '@models/ugc-filters';
import { Observable, timer } from 'rxjs';
import { WoodstockService } from '@services/woodstock';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { pull } from 'lodash';

/** Displays sunrise UGC content in a table. */
@Component({
  selector: 'woodstock-ugc-table',
  templateUrl: '../ugc-table.component.html',
  styleUrls: ['../ugc-table.component.scss'],
})
export class WoodstockUGCTableComponent extends UGCTableBaseComponent implements OnChanges {
  public gameTitle = GameTitleCodeName.FH5;

  constructor(protected dialog: MatDialog, private readonly woodstockService: WoodstockService) {
    super();
  }

  /** Opens the feature UGC modal. */
  public openFeatureUGCModal(item: PlayerUGCItem): void {
    this.dialog
      .open(WoodstockFeatureUGCModalComponent, {
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
    return this.woodstockService.getPlayerUGCItem(id, type);
  }

  /** Hide UGC item. */
  public hideUGCItem(item: PlayerUGCItemTableEntries): void {
    item.monitor = new ActionMonitor(item.monitor.dispose().label);

    this.woodstockService
      .hideUgc$(item.guidId)
      .pipe(item.monitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.deleteEntry(item);
      });
  }

  private deleteEntry(item: PlayerUGCItemTableEntries): void {
    // Wait for monitor snackbar to fire before removing entry and disposing monitor
    timer(0)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        pull(this.ugcTableDataSource.data, item);

        pull(this.allMonitors, item.monitor);
        item.monitor.dispose();

        this.ugcTableDataSource._updateChangeSubscription();
      });
  }
}
