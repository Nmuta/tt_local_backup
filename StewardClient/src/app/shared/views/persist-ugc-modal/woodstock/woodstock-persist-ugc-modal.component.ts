import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GameTitle } from '@models/enums';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { WoodstockService } from '@services/woodstock';
import { PersistUgcService } from '../persist-ugc-modal.component';

/** Woodstock modal to set featured status of a UGC item. */
@Component({
  templateUrl: './woodstock-persist-ugc-modal.component.html',
  styleUrls: ['./woodstock-persist-ugc-modal.component.scss'],
})
export class WoodstockPersistUgcModalComponent {
  public service: PersistUgcService;

  public persistUgcPermAttribute = PermAttributeName.PersistUgc;

  constructor(
    private readonly woodstockService: WoodstockService,
    protected dialogRef: MatDialogRef<WoodstockPersistUgcModalComponent>,
    @Inject(MAT_DIALOG_DATA) protected data: PlayerUgcItem,
  ) {
    this.service = {
      title: GameTitle.FH5,
      getUgcItem$: (itemId, type) => woodstockService.getPlayerUgcItem$(itemId, type),
      persistUgc$: (itemId, title, description) => woodstockService.persistUgc$(itemId, title, description),
    }
  }
}
