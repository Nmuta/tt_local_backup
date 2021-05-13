import { Component, OnInit } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { GravityPlayerInventory, GravityPseudoPlayerInventoryProfile } from '@models/gravity';
import { IdentityResultBeta, IdentityResultBetaBatch } from '@models/identity-query.model';
import { AugmentedCompositeIdentity } from '@navbar-app/components/player-selection/player-selection-base.component';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GiftingBaseComponent } from '../base/gifting.base.component';
import { GravityGiftingState } from './state/gravity-gifting.state';
import { SetGravitySelectedPlayerIdentities } from './state/gravity-gifting.state.actions';

/** The gravity gifting page for the Navbar app. */
@Component({
  templateUrl: './gravity-gifting.component.html',
  styleUrls: ['./gravity-gifting.component.scss'],
})
export class GravityGiftingComponent extends GiftingBaseComponent<string> implements OnInit {
  @Select(GravityGiftingState.selectedPlayerIdentities)
  public selectedPlayerIdentities$: Observable<IdentityResultBetaBatch>;

  /** Game title. */
  public title: GameTitleCodeName = GameTitleCodeName.Street;
  /** All selected player identities from player selection tool. */
  public selectedPlayerIdentities: IdentityResultBetaBatch;
  /** Selected player identity when user clicks on identity chip. */
  public selectedPlayerIdentity: IdentityResultBeta;
  public selectedPlayerInventoryProfile: GravityPseudoPlayerInventoryProfile;
  public selectedPlayerInventory: GravityPlayerInventory;

  constructor(private readonly store: Store) {
    super();
  }

  /** Initialization hook */
  public ngOnInit(): void {
    this.selectedPlayerIdentities$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((playerIdentities: IdentityResultBetaBatch) => {
        this.selectedPlayerIdentities = playerIdentities;
      });
  }

  /** Logic when player selection outputs identities. */
  public onPlayerIdentityChange(identity: AugmentedCompositeIdentity): void {
    const newIdentities = [identity].filter(i => i?.extra?.hasGravity).map(i => i.gravity);
    this.store.dispatch(new SetGravitySelectedPlayerIdentities(newIdentities));
  }

  /** Player identity selected */
  public playerIdentitySelected(identity: AugmentedCompositeIdentity): void {
    this.selectedPlayerIdentity = identity?.extra?.hasGravity ? identity.gravity : null;
  }

  /** Called when a player inventory is selected and found. */
  public onInventoryFound(inventory: GravityPlayerInventory): void {
    this.selectedPlayerInventory = inventory;
  }

  /** Produces a rejection message from a given identity, if it is rejected. */
  public identityRejectionFn(identity: AugmentedCompositeIdentity): string {
    if (!identity?.extra?.hasGravity) {
      return 'Player does not have a gravity account. Player will be ignored.';
    }

    return null;
  }
}
