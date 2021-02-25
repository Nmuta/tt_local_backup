import { Component, OnInit } from '@angular/core';
import { GameTitleCodeName, UserRole } from '@models/enums';
import { IdentityResultAlphaBatch, IdentityResultAlpha } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { SunriseMasterInventory, SunrisePlayerInventoryProfile } from '@models/sunrise';
import { UserModel } from '@models/user.model';
import { AugmentedCompositeIdentity } from '@navbar-app/components/player-selection/player-selection-base.component';
import { Select, Store } from '@ngxs/store';
import { UserState, USER_STATE_NOT_FOUND } from '@shared/state/user/user.state';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GiftingBaseComponent } from '../base/gifting.base.component';
import { SunriseGiftingState } from './state/sunrise-gifting.state';
import {
  SetSunriseGiftingMatTabIndex,
  SetSunriseGiftingSelectedPlayerIdentities,
} from './state/sunrise-gifting.state.actions';

/** The sunrise gifting page for the Navbar app. */
@Component({
  templateUrl: './sunrise-gifting.component.html',
  styleUrls: ['./sunrise-gifting.component.scss'],
})
export class SunriseGiftingComponent
  extends GiftingBaseComponent
  implements OnInit {
  @Select(SunriseGiftingState.selectedPlayerIdentities)
  public selectedPlayerIdentities$: Observable<IdentityResultAlphaBatch>;

  /** Game title. */
  public title: GameTitleCodeName = GameTitleCodeName.FH4;
  /** All selected player identities from player selection tool. */
  public selectedPlayerIdentities: IdentityResultAlphaBatch;
  /** Selected LSP group. */
  public selectedLspGroup: LspGroup;
  /** Selected player identity when user clicks on identity chip. */
  public selectedPlayerIdentity: IdentityResultAlpha;
  public selectedPlayerInventoryProfile: SunrisePlayerInventoryProfile;
  public selectedPlayerInventory: SunriseMasterInventory;

  public disableLspGroupSelection: boolean = true;

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
    const newIdentities = identity.filter(i => i.extra.hasSunrise);
    this.store.dispatch(new SetSunriseGiftingSelectedPlayerIdentities(newIdentities));
  }

  /** Player identity selected */
  public playerIdentitySelected(identity: AugmentedCompositeIdentity): void {
    this.selectedPlayerIdentity = identity.extra.hasSunrise ? identity.sunrise : null;
  }

  /** Called when a player inventory is selected and found. */
  public onInventoryFound(inventory: SunriseMasterInventory): void {
    this.selectedPlayerInventory = inventory;
  }
}
