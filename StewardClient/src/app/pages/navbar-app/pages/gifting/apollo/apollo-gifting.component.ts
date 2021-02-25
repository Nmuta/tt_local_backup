import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  SetApolloGiftingMatTabIndex,
  SetApolloGiftingSelectedPlayerIdentities,
} from './state/apollo-gifting.state.actions';
import { ApolloGiftingState } from './state/apollo-gifting.state';
import { GameTitleCodeName, UserRole } from '@models/enums';
import { IdentityResultAlpha, IdentityResultAlphaBatch } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { UserModel } from '@models/user.model';
import { UserState, USER_STATE_NOT_FOUND } from '@shared/state/user/user.state';
import { GiftingBaseComponent } from '../base/gifting.base.component';
import { ApolloPlayerInventory, ApolloPlayerInventoryProfile } from '@models/apollo';
import { AugmentedCompositeIdentity } from '@navbar-app/components/player-selection/player-selection-base.component';

/** The gifting page for the Navbar app. */
@Component({
  templateUrl: './apollo-gifting.component.html',
  styleUrls: ['./apollo-gifting.component.scss'],
})
export class ApolloGiftingComponent
  extends GiftingBaseComponent
  implements OnInit {
  @Select(ApolloGiftingState.selectedPlayerIdentities) public selectedPlayerIdentities$: Observable<
    IdentityResultAlphaBatch
  >;

  public title: GameTitleCodeName = GameTitleCodeName.FM7;
  public selectedPlayerIdentities: IdentityResultAlphaBatch;
  public selectedLspGroup: LspGroup;
  /** Selected player identity when user clicks on identity chip. */
  public selectedPlayerIdentity: IdentityResultAlpha;
  public selectedPlayerInventoryProfile: ApolloPlayerInventoryProfile;
  public selectedPlayerInventory: ApolloPlayerInventory;

  constructor(protected readonly store: Store) {
    super();
  }

  /** Initialization hook */
  public ngOnInit(): void {
    const user = this.store.selectSnapshot<UserModel | USER_STATE_NOT_FOUND>(UserState.profile);
    if (!user) {
      throw new Error('Gifting component entered without user.');
    }
    if (user === UserState.NOT_FOUND) {
      throw new Error('Gifting component entered with non-existing user.');
    }

    this.disableLspGroupSelection = user.role !== UserRole.LiveOpsAdmin;

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
  public onPlayerIdentitiesChange(identity: AugmentedCompositeIdentity): void {
    const newIdentity = identity.extra.hasApollo ? identity.apollo : null
    this.store.dispatch(new SetApolloGiftingSelectedPlayerIdentities([newIdentity]));
  }

  /** Player identity selected */
  public playerIdentitySelected(identity: AugmentedCompositeIdentity): void {
    this.selectedPlayerIdentity = identity.extra.hasApollo ? identity.apollo : null;
  }

  /** Called when a player inventory is selected and found. */
  public onInventoryFound(inventory: ApolloPlayerInventory): void {
    this.selectedPlayerInventory = inventory;
  }
}
