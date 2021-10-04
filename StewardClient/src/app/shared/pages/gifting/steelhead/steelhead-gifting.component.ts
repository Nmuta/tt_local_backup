import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  SetSteelheadGiftingMatTabIndex,
  SetSteelheadGiftingSelectedPlayerIdentities,
} from './state/steelhead-gifting.state.actions';
import { SteelheadGiftingState } from './state/steelhead-gifting.state';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultAlpha, IdentityResultAlphaBatch } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { UserModel } from '@models/user.model';
import { UserState } from '@shared/state/user/user.state';
import { GiftingBaseComponent } from '../base/gifting.base.component';
import { SteelheadMasterInventory, SteelheadPlayerInventoryProfile } from '@models/steelhead';
import { AugmentedCompositeIdentity } from '@navbar-app/components/player-selection/player-selection-base.component';
import BigNumber from 'bignumber.js';

/** The gifting page for the Navbar app. */
@Component({
  templateUrl: './steelhead-gifting.component.html',
  styleUrls: ['./steelhead-gifting.component.scss'],
})
export class SteelheadGiftingComponent extends GiftingBaseComponent<BigNumber> implements OnInit {
  @Select(SteelheadGiftingState.selectedPlayerIdentities)
  public selectedPlayerIdentities$: Observable<IdentityResultAlphaBatch>;

  public title: GameTitleCodeName = GameTitleCodeName.FM8;
  public selectedPlayerIdentities: IdentityResultAlphaBatch;
  public selectedLspGroup: LspGroup;
  /** Selected player identity when user clicks on identity chip. */
  public selectedPlayerIdentity: IdentityResultAlpha;
  public selectedPlayerInventoryProfile: SteelheadPlayerInventoryProfile;
  public selectedPlayerInventory: SteelheadMasterInventory;

  constructor(private readonly store: Store) {
    super();
  }

  /** Initialization hook */
  public ngOnInit(): void {
    const user = this.store.selectSnapshot<UserModel>(UserState.profile);
    this.disableLspGroupSelection = user.role !== 'LiveOpsAdmin';

    this.matTabSelectedIndex = this.store.selectSnapshot<number>(
      SteelheadGiftingState.selectedMatTabIndex,
    );

    this.selectedPlayerIdentities$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((playerIdentities: IdentityResultAlphaBatch) => {
        this.selectedPlayerIdentities = playerIdentities;
      });
  }

  /** Tracks when the mat tab is changed  */
  public matTabSelectionChange(index: number): void {
    this.store.dispatch(new SetSteelheadGiftingMatTabIndex(index));
  }

  /** Logic when player selection outputs identities. */
  public onPlayerIdentityChange(identity: AugmentedCompositeIdentity): void {
    const newIdentities = [identity].filter(i => i?.extra?.hasSteelhead).map(i => i.steelhead);
    this.store.dispatch(new SetSteelheadGiftingSelectedPlayerIdentities(newIdentities));
  }

  /** Player identity selected */
  public playerIdentitySelected(identity: AugmentedCompositeIdentity): void {
    this.selectedPlayerIdentity = identity?.extra?.hasSteelhead ? identity.steelhead : null;
  }

  /** Called when a player inventory is selected and found. */
  public onInventoryFound(inventory: SteelheadMasterInventory): void {
    this.selectedPlayerInventory = inventory;
  }

  /** Produces a rejection message from a given identity, if it is rejected. */
  public identityRejectionFn(identity: AugmentedCompositeIdentity): string {
    if (!identity?.extra?.hasSteelhead) {
      return 'Player does not have an steelhead account at the selected endpoint. Player will be ignored.';
    }

    return null;
  }
}
