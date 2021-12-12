import { Component, OnInit } from '@angular/core';
import { GameTitle } from '@models/enums';
import { IdentityResultAlphaBatch, IdentityResultAlpha } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { SunriseMasterInventory, SunrisePlayerInventoryProfile } from '@models/sunrise';
import { UserModel } from '@models/user.model';
import { AugmentedCompositeIdentity } from '@views/player-selection/player-selection-base.component';
import { Select, Store } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SunriseGiftingState } from './state/sunrise-gifting.state';
import {
  SetSunriseGiftingMatTabIndex,
  SetSunriseGiftingSelectedPlayerIdentities,
} from './state/sunrise-gifting.state.actions';
import { GiftingBaseComponent } from '../base/gifting.base.component';
import { hasAccessToRestrictedFeature, RestrictedFeature } from '@environments/environment';

/** The sunrise gifting page. */
@Component({
  templateUrl: './sunrise-gifting.component.html',
  styleUrls: ['./sunrise-gifting.component.scss'],
})
export class SunriseGiftingComponent extends GiftingBaseComponent<BigNumber> implements OnInit {
  @Select(SunriseGiftingState.selectedPlayerIdentities)
  public selectedPlayerIdentities$: Observable<IdentityResultAlphaBatch>;

  /** All selected player identities from player selection tool. */
  public selectedPlayerIdentities: IdentityResultAlphaBatch;
  /** Selected LSP group. */
  public selectedLspGroup: LspGroup;
  /** Selected player identity when user clicks on identity chip. */
  public selectedPlayerIdentity: IdentityResultAlpha;
  public selectedPlayerInventoryProfile: SunrisePlayerInventoryProfile;
  public selectedPlayerInventory: SunriseMasterInventory;

  public disableLspGroupSelection: boolean = true;

  /** Tooltip for disabled LSP group selection tab., */
  public groupGiftTabTooltip: string = null;

  constructor(private readonly store: Store) {
    super();
  }

  /** Initialization hook */
  public ngOnInit(): void {
    const user = this.store.selectSnapshot<UserModel>(UserState.profile);
    this.disableLspGroupSelection = !hasAccessToRestrictedFeature(
      RestrictedFeature.GroupGifting,
      GameTitle.FM7,
      user.role,
    );

    if (this.disableLspGroupSelection) {
      this.groupGiftTabTooltip = `Feature is not supported for your user role: ${user.role}`;
    }

    this.matTabSelectedIndex = this.store.selectSnapshot<number>(
      SunriseGiftingState.selectedMatTabIndex,
    );

    this.selectedPlayerIdentities$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((playerIdentities: IdentityResultAlphaBatch) => {
        this.selectedPlayerIdentities = playerIdentities;
      });
  }

  /** Tracks when the mat tab is changed  */
  public matTabSelectionChange(index: number): void {
    this.store.dispatch(new SetSunriseGiftingMatTabIndex(index));
  }

  /** Logic when player selection outputs identities. */
  public onPlayerIdentitiesChange(identity: AugmentedCompositeIdentity[]): void {
    const newIdentities = identity.filter(i => i?.extra?.hasSunrise).map(i => i.sunrise);
    this.store.dispatch(new SetSunriseGiftingSelectedPlayerIdentities(newIdentities));
  }

  /** Player identity selected */
  public playerIdentitySelected(identity: AugmentedCompositeIdentity): void {
    this.selectedPlayerIdentity = identity?.extra?.hasSunrise ? identity.sunrise : null;
  }

  /** Called when a player inventory is selected and found. */
  public onInventoryFound(inventory: SunriseMasterInventory): void {
    this.selectedPlayerInventory = inventory;
  }

  /** Produces a rejection message from a given identity, if it is rejected. */
  public identityRejectionFn(identity: AugmentedCompositeIdentity): string {
    if (!identity?.extra?.hasSunrise) {
      return 'Player does not have a sunrise account at the selected endpoint. Player will be ignored.';
    }

    return null;
  }
}
