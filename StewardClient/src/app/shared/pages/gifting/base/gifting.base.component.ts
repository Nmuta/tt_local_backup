import { Component } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { GameTitleCodeName } from '@models/enums';

/** The sunrise gifting page for the Navbar app. */
@Component({
  template: '',
})
export abstract class GiftingBaseComponent extends BaseComponent {
  public title: GameTitleCodeName = GameTitleCodeName.FH4;
  public matTabSelectedIndex: number = 0;
  public disableLspGroupSelection: boolean = true;

  /** Returns true if player identities is  being used for player selection. */
  public isUsingPlayerIdentities(): boolean {
    return this.matTabSelectedIndex === 0;
  }
}
