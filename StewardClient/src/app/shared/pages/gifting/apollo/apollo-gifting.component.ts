import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  SetApolloGiftingMatTabIndex,
  SetApolloGiftingSelectedPlayerIdentities,
} from './state/apollo-gifting.state.actions';
import { ApolloGiftingState } from './state/apollo-gifting.state';
import { GameTitle, GameTitleCodeName } from '@models/enums';
import { IdentityResultAlpha, IdentityResultAlphaBatch } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { UserModel } from '@models/user.model';
import { UserState } from '@shared/state/user/user.state';
import { GiftingBaseComponent } from '../base/gifting.base.component';
import { ApolloMasterInventory, ApolloPlayerInventoryProfile } from '@models/apollo';
import { AugmentedCompositeIdentity } from '@views/player-selection/player-selection-base.component';
import BigNumber from 'bignumber.js';
import { hasAccessToRestrictedFeature, RestrictedFeature } from '@environments/environment';

/** The gifting page for the Navbar app. */
@Component({
  templateUrl: './apollo-gifting.component.html',
  styleUrls: ['./apollo-gifting.component.scss'],
})
export class ApolloGiftingComponent extends GiftingBaseComponent<BigNumber> implements OnInit {
  @Select(ApolloGiftingState.selectedPlayerIdentities) public selectedPlayerIdentities$: Observable<
    IdentityResultAlphaBatch
  >;

  public title: GameTitleCodeName = GameTitleCodeName.FM7;
  public selectedPlayerIdentities: IdentityResultAlphaBatch;
  public selectedLspGroup: LspGroup;
  /** Selected player identity when user clicks on identity chip. */
  public selectedPlayerIdentity: IdentityResultAlpha;
  public selectedPlayerInventoryProfile: ApolloPlayerInventoryProfile;
  public selectedPlayerInventory: ApolloMasterInventory;

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
      ApolloGiftingState.selectedMatTabIndex,
    );

    this.selectedPlayerIdentities$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((playerIdentities: IdentityResultAlphaBatch) => {
        this.selectedPlayerIdentities = playerIdentities;
      });
  }

  /** Tracks when the mat tab is changed  */
  public matTabSelectionChange(index: number): void {
    this.store.dispatch(new SetApolloGiftingMatTabIndex(index));
  }

  /** Logic when player selection outputs identities. */
  public onPlayerIdentityChange(identity: AugmentedCompositeIdentity): void {
    const newIdentities = [identity].filter(i => i?.extra?.hasApollo).map(i => i.apollo);
    this.store.dispatch(new SetApolloGiftingSelectedPlayerIdentities(newIdentities));
  }

  /** Player identity selected */
  public playerIdentitySelected(identity: AugmentedCompositeIdentity): void {
    this.selectedPlayerIdentity = identity?.extra?.hasApollo ? identity.apollo : null;
  }

  /** Called when a player inventory is selected and found. */
  public onInventoryFound(inventory: ApolloMasterInventory): void {
    this.selectedPlayerInventory = inventory;
  }

  /** Produces a rejection message from a given identity, if it is rejected. */
  public identityRejectionFn(identity: AugmentedCompositeIdentity): string {
    if (!identity?.extra?.hasApollo) {
      return 'Player does not have an apollo account at the selected endpoint. Player will be ignored.';
    }

    return null;
  }
}
