import { Component } from '@angular/core';
import { GameTitle } from '@models/enums';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { UgcType } from '@models/ugc-filters';
import { WoodstockService } from '@services/woodstock';
import { Observable } from 'rxjs';
import { EditUgcContract } from '../edit-ugc-modal.component';
import { BaseComponent } from '@components/base-component/base.component';
import { WoodstockUgcEditService } from '@services/api-v2/woodstock/ugc/edit/woodstock-ugc-edit.service';
import { UgcEditInput } from '@models/ugc-edit-input';

/** Woodstock modal to edit a UGC item. */
@Component({
  templateUrl: './woodstock-edit-ugc-modal.component.html',
  styleUrls: ['../edit-ugc-modal.component.scss'],
})
export class WoodstockEditUgcModalComponent extends BaseComponent {
  public service: EditUgcContract;

  constructor(
    woodstockService: WoodstockService,
    woodstockUgcEditService: WoodstockUgcEditService,
  ) {
    super();

    this.service = {
      gameTitle: GameTitle.FH5,
      getUgcItem$(itemId: string, type: UgcType): Observable<PlayerUgcItem> {
        return woodstockService.getPlayerUgcItem$(itemId, type);
      },
      editUgcItem$(itemId: string, ugcEditInput: UgcEditInput): Observable<void> {
        return woodstockUgcEditService.editUgc$(itemId, ugcEditInput);
      },
    };
  }
}
