import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { hasAccessToRestrictedFeature, RestrictedFeature } from '@environments/environment';
import { GameTitle } from '@models/enums';
import { UserModel } from '@models/user.model';
import { Store } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';
import BigNumber from 'bignumber.js';

/** The sunrise gifting page for the Navbar app. */
@Component({
  template: '',
})
export abstract class GiftingBaseComponent<ProfileIdType extends BigNumber | string>
  extends BaseComponent
  implements OnInit
{
  public matTabSelectedIndex: number = 0;
  public disableLspGroupSelection: boolean = true;
  public disableGiftingLiveries: boolean = true;
  public selectedPlayerInventoryProfileId: ProfileIdType;
  public get disableBulkGiftingLiveries(): boolean {
    return !this.isUsingPlayerIdentities;
  }

  public featureDisabledText = `Feature is not supported for your user role.`;

  /** Returns true if player identities is  being used for player selection. */
  public get isUsingPlayerIdentities(): boolean {
    return this.matTabSelectedIndex === 0;
  }

  /** The group gifting tooltip. */
  public get groupGiftingTooltip(): string {
    return this.disableLspGroupSelection ? this.featureDisabledText : null;
  }

  /** The gifting livery tooltip. */
  public get giftingLiveryTooltip(): string {
    return this.disableGiftingLiveries ? this.featureDisabledText : null;
  }

  public abstract gameTitle: GameTitle;

  constructor(protected readonly store: Store) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    const user = this.store.selectSnapshot<UserModel>(UserState.profile);
    this.disableLspGroupSelection = !hasAccessToRestrictedFeature(
      RestrictedFeature.GroupGifting,
      this.gameTitle,
      user.role,
    );

    this.disableGiftingLiveries = !hasAccessToRestrictedFeature(
      RestrictedFeature.GiftLivery,
      this.gameTitle,
      user.role,
    );
  }
}
