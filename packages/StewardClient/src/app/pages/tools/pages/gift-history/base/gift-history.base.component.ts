import { Component } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitleCodeName } from '@models/enums';
import { OldPlayerInventoryProfile } from '@models/player-inventory-profile';

/** The sunrise gift history page for the Navbar app. */
@Component({
  template: '',
})
export abstract class GiftHistoryBaseComponent<
  ProfileIdType extends OldPlayerInventoryProfile,
> extends BaseComponent {
  public title: GameTitleCodeName = GameTitleCodeName.FH4;
  public matTabSelectedIndex: number = 0;
  public disableLspGroupSelection: boolean = true;
  public selectedPlayerInventoryProfile: ProfileIdType;
}
