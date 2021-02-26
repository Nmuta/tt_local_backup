import { Component, OnInit } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { GravityPlayerInventoryBeta, GravityPseudoPlayerInventoryProfile } from '@models/gravity';
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
export class GravityGiftingComponent extends GiftingBaseComponent implements OnInit {
  @Select(GravityGiftingState.selectedPlayerIdentities)
  public selectedPlayerIdentities$: Observable<IdentityResultBetaBatch>;

  /** Game title. */
  public title: GameTitleCodeName = GameTitleCodeName.Street;
  /** All selected player identities from player selection tool. */
  public selectedPlayerIdentities: IdentityResultBetaBatch;
  /** Selected player identity when user clicks on identity chip. */
  public selectedPlayerIdentity: IdentityResultBeta;
  public selectedPlayerInventoryProfile: GravityPseudoPlayerInventoryProfile;
  public selectedPlayerInventory: GravityPlayerInventoryBeta;

  constructor(protected readonly store: Store) {
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
    const newIdentity = identity.extra.hasGravity ? identity.gravity : null;
    this.selectedPlayerIdentities = [newIdentity];
    this.store.dispatch(new SetGravitySelectedPlayerIdentities([newIdentity]));
  }

  /** Player identity selected */
  public playerIdentitySelected(identity: AugmentedCompositeIdentity): void {
    this.selectedPlayerIdentity = identity.extra.hasGravity ? identity.gravity : null;
  }

  /** Called when a player inventory is selected and found. */
  public onInventoryFound(inventory: GravityPlayerInventoryBeta): void {
    this.selectedPlayerInventory = inventory;
  }
}
