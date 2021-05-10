import { Component, OnInit } from '@angular/core';
import { GameTitleCodeName, UserRole } from '@models/enums';
import { IdentityResultAlphaBatch, IdentityResultAlpha } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { WoodstockMasterInventory, WoodstockPlayerInventoryProfile } from '@models/woodstock';
import { UserModel } from '@models/user.model';
import { AugmentedCompositeIdentity } from '@navbar-app/components/player-selection/player-selection-base.component';
import { Select, Store } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GiftingBaseComponent } from '../base/gifting.base.component';
import { WoodstockGiftingState } from './state/woodstock-gifting.state';
import {
  SetWoodstockGiftingMatTabIndex,
  SetWoodstockGiftingSelectedPlayerIdentities,
} from './state/woodstock-gifting.state.actions';

/** The woodstock gifting page for the Navbar app. */
@Component({
  templateUrl: './woodstock-gifting.component.html',
  styleUrls: ['./woodstock-gifting.component.scss'],
})
export class WoodstockGiftingComponent extends GiftingBaseComponent implements OnInit {
  @Select(WoodstockGiftingState.selectedPlayerIdentities)
  public selectedPlayerIdentities$: Observable<IdentityResultAlphaBatch>;

  /** Game title. */
  public title: GameTitleCodeName = GameTitleCodeName.FH5;
  /** All selected player identities from player selection tool. */
  public selectedPlayerIdentities: IdentityResultAlphaBatch;
  /** Selected LSP group. */
  public selectedLspGroup: LspGroup;
  /** Selected player identity when user clicks on identity chip. */
  public selectedPlayerIdentity: IdentityResultAlpha;
  public selectedPlayerInventoryProfile: WoodstockPlayerInventoryProfile;
  public selectedPlayerInventory: WoodstockMasterInventory;

  public disableLspGroupSelection: boolean = true;

  constructor(private readonly store: Store) {
    super();
  }

  /** Initialization hook */
  public ngOnInit(): void {
    const user = this.store.selectSnapshot<UserModel>(UserState.profile);
    this.disableLspGroupSelection = user.role !== UserRole.LiveOpsAdmin;

    this.matTabSelectedIndex = this.store.selectSnapshot<number>(
      WoodstockGiftingState.selectedMatTabIndex,
    );
    this.selectedPlayerIdentities$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((playerIdentities: IdentityResultAlphaBatch) => {
        this.selectedPlayerIdentities = playerIdentities;
      });
  }

  /** Tracks when the mat tab is changed  */
  public matTabSelectionChange(index: number): void {
    this.store.dispatch(new SetWoodstockGiftingMatTabIndex(index));
  }

  /** Logic when player selection outputs identities. */
  public onPlayerIdentitiesChange(identity: AugmentedCompositeIdentity[]): void {
    const newIdentities = identity.filter(i => i?.extra?.hasWoodstock).map(i => i.woodstock);
    this.store.dispatch(new SetWoodstockGiftingSelectedPlayerIdentities(newIdentities));
  }

  /** Player identity selected */
  public playerIdentitySelected(identity: AugmentedCompositeIdentity): void {
    this.selectedPlayerIdentity = identity?.extra?.hasWoodstock ? identity.woodstock : null;
  }

  /** Called when a player inventory is selected and found. */
  public onInventoryFound(inventory: WoodstockMasterInventory): void {
    this.selectedPlayerInventory = inventory;
  }

  /** Produces a rejection message from a given identity, if it is rejected. */
  public identityRejectionFn(identity: AugmentedCompositeIdentity): string {
    if (!identity?.extra?.hasWoodstock) {
      return 'Player does not have a woodstock account. Player will be ignored.';
    }

    return null;
  }
}
