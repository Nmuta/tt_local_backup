import { Component, OnChanges } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { PlayerUGCItem } from '@models/player-ugc-item';
import { MatDialog } from '@angular/material/dialog';
import { WoodstockFeatureUGCModalComponent } from '@views/feature-ugc-modal/woodstock/woodstock-feature-ugc-modal.component';
import { filter, takeUntil } from 'rxjs/operators';
import { UGCTableBaseComponent } from '../ugc-table.component';

/** Displays sunrise UGC content in a table. */
@Component({
  selector: 'woodstock-ugc-table',
  templateUrl: '../ugc-table.component.html',
  styleUrls: ['../ugc-table.component.scss'],
})
export class WoodstockUGCTableComponent extends UGCTableBaseComponent implements OnChanges {
  public gameTitle = GameTitleCodeName.FH5;

  constructor(protected dialog: MatDialog) {
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
}
