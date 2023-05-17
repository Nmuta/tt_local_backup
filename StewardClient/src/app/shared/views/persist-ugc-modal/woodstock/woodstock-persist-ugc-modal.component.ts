import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GameTitle } from '@models/enums';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { WoodstockService } from '@services/woodstock';
import { PersistUgcService } from '../persist-ugc-modal.component';

/** Woodstock modal to persist a UGC item. */
@Component({
  templateUrl: './woodstock-persist-ugc-modal.component.html',
  styleUrls: ['./woodstock-persist-ugc-modal.component.scss'],
})
export class WoodstockPersistUgcModalComponent {
  public service: PersistUgcService;

  public persistUgcPermAttribute = PermAttributeName.PersistUgc;

  constructor(
    private readonly woodstockService: WoodstockService,
    @Inject(MAT_DIALOG_DATA) protected data: PlayerUgcItem,
  ) {
    this.service = {
      title: GameTitle.FH5,
      persistUgc$: (itemId, title, description) =>
        woodstockService.persistUgc$(itemId, title, description),
    };
  }
}
