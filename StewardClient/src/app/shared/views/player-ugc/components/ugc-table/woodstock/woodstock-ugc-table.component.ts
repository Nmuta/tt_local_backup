import { Component, OnChanges } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { MatDialog } from '@angular/material/dialog';
import { WoodstockFeatureUgcModalComponent } from '@views/feature-ugc-modal/woodstock/woodstock-feature-ugc-modal.component';
import { filter, takeUntil } from 'rxjs/operators';
import { PlayerUgcItemTableEntries, UgcTableBaseComponent } from '../ugc-table.component';
import { UgcType } from '@models/ugc-filters';
import { Observable } from 'rxjs';
import { WoodstockService } from '@services/woodstock';
import { pull } from 'lodash';
import { renderGuard } from '@helpers/rxjs';
import { PermissionsService } from '@services/permissions';

/** Displays sunrise UGC content in a table. */
@Component({
  selector: 'woodstock-ugc-table',
  templateUrl: '../ugc-table.component.html',
  styleUrls: ['../ugc-table.component.scss'],
})
export class WoodstockUgcTableComponent extends UgcTableBaseComponent implements OnChanges {
  public gameTitle = GameTitleCodeName.FH5;

  constructor(
    private readonly dialog: MatDialog,
    private readonly woodstockService: WoodstockService,
    permissionsService: PermissionsService,
  ) {
    super(permissionsService);
  }

  /** Opens the feature UGC modal. */
  public openFeatureUgcModal(item: PlayerUgcItem): void {
    this.dialog
      .open(WoodstockFeatureUgcModalComponent, {
        data: item,
      })
      .afterClosed()
      .pipe(
        filter(data => !!data),
        takeUntil(this.onDestroy$),
      )
      .subscribe((response: PlayerUgcItem) => {
        const updatedData = this.ugcTableDataSource.data;
        const itemToUpdateIndex = updatedData.findIndex(item => item.id === response.id);

        if (itemToUpdateIndex >= 0) {
          updatedData[itemToUpdateIndex] = response;
          this.ugcTableDataSource.data = updatedData;
        }
      });
  }

  /** Gets player UGC item. */
  public getUgcItem(id: string, type: UgcType): Observable<PlayerUgcItem> {
    return this.woodstockService.getPlayerUgcItem(id, type);
  }

  /** Hide UGC item. */
  public hideUgcItem(item: PlayerUgcItemTableEntries): void {
    item.monitor = item.monitor.repeat();

    this.woodstockService
      .hideUgc$(item.id)
      .pipe(item.monitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.deleteEntry(item);
      });
  }

  private deleteEntry(item: PlayerUgcItemTableEntries): void {
    renderGuard(() => {
      pull(this.ugcTableDataSource.data, item);

      pull(this.allMonitors, item.monitor);
      item.monitor.dispose();

      this.ugcTableDataSource._updateChangeSubscription();
    });
  }
}
