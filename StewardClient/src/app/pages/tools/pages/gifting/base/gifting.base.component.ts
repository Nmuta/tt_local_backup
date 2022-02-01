import { Component } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import BigNumber from 'bignumber.js';

/** The sunrise gifting page for the Navbar app. */
@Component({
  template: '',
})
export abstract class GiftingBaseComponent<
  ProfileIdType extends BigNumber | string,
> extends BaseComponent {
  public matTabSelectedIndex: number = 0;
  public disableLspGroupSelection: boolean = true;
  public selectedPlayerInventoryProfileId: ProfileIdType;

  /** Returns true if player identities is  being used for player selection. */
  public get isUsingPlayerIdentities(): boolean {
    return this.matTabSelectedIndex === 0;
  }
}
