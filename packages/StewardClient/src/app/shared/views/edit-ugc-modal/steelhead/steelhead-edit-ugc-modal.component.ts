import { Component } from '@angular/core';
import { GameTitle } from '@models/enums';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { UgcType } from '@models/ugc-filters';
import { Observable } from 'rxjs';
import { EditUgcContract } from '../edit-ugc-modal.component';
import { BaseComponent } from '@components/base-component/base.component';
import { SteelheadUgcLookupService } from '@services/api-v2/steelhead/ugc/lookup/steelhead-ugc-lookup.service';
import { SteelheadUgcEditService } from '@services/api-v2/steelhead/ugc/edit/steelhead-ugc-edit.service';
import { UgcEditInput } from '@models/ugc-edit-input';

/** Steelhead modal to edit a UGC item. */
@Component({
  templateUrl: './steelhead-edit-ugc-modal.component.html',
  styleUrls: ['../edit-ugc-modal.component.scss'],
})
export class SteelheadEditUgcModalComponent extends BaseComponent {
  public service: EditUgcContract;

  constructor(
    steelheadUgcLookupService: SteelheadUgcLookupService,
    steelheadUgcEditService: SteelheadUgcEditService,
  ) {
    super();

    this.service = {
      gameTitle: GameTitle.FH5,
      getUgcItem$(itemId: string, type: UgcType): Observable<PlayerUgcItem> {
        return steelheadUgcLookupService.getPlayerUgcItem$(itemId, type);
      },
      editUgcItem$(itemId: string, ugcEditInput: UgcEditInput): Observable<void> {
        return steelheadUgcEditService.editUgc$(itemId, ugcEditInput);
      },
    };
  }
}
