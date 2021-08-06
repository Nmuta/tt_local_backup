import { Component, OnChanges } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { PlayerUGCItem } from '@models/player-ugc-item';
import { MatDialog } from '@angular/material/dialog';
import { SunriseFeatureUGCModalComponent } from '@views/feature-ugc-modal/sunrise/sunrise-feature-ugc-modal.component';
import { filter, takeUntil } from 'rxjs/operators';
import { UGCTableBaseComponent } from '../ugc-table.component';

/** Displays sunrise UGC content in a table. */
@Component({
  selector: 'sunrise-ugc-table',
  templateUrl: '../ugc-table.component.html',
  styleUrls: ['../ugc-table.component.scss'],
})
export class SunriseUGCTableComponent extends UGCTableBaseComponent implements OnChanges {
  public gameTitle = GameTitleCodeName.FH4;

  constructor(protected dialog: MatDialog) {
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
        takeUntil(this.onDestroy$),
        filter(data => !!data),
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
