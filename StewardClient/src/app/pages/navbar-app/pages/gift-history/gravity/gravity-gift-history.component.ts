import { Component, OnInit } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultBeta, IdentityResultBetaBatch } from '@models/identity-query.model';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GiftHistoryBaseComponent } from '../base/gift-history.base.component';
import { GravityGiftHistoryState } from './state/gravity-gift-history.state';
import { SetGravitySelectedPlayerIdentities } from './state/gravity-gift-history.state.actions';
import { first } from 'lodash';
import { AugmentedCompositeIdentity } from '@navbar-app/components/player-selection/player-selection-base.component';

/** The gravity gift history page for the Navbar app. */
@Component({
  templateUrl: './gravity-gift-history.component.html',
  styleUrls: ['./gravity-gift-history.component.scss'],
})
export class GravityGiftHistoryComponent extends GiftHistoryBaseComponent implements OnInit {
  @Select(GravityGiftHistoryState.selectedPlayerIdentities)
  public selectedPlayerIdentities$: Observable<IdentityResultBetaBatch>;

  public title: GameTitleCodeName = GameTitleCodeName.Street;
  public selectedPlayerIdentities: IdentityResultBetaBatch;
  /** Selected player identity when user clicks on identity chip. */
  public selectedPlayerIdentity: IdentityResultBeta;
  public selectedPlayer: IdentityResultBeta;

  constructor(protected readonly store: Store) {
    super();
  }

  /** Initialization hook */
  public ngOnInit(): void {
    this.selectedPlayerIdentities$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((playerIdentities: IdentityResultBetaBatch) => {
        this.selectedPlayerIdentities = playerIdentities;
        this.selectedPlayer = first(this.selectedPlayerIdentities);
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

  /** Produces a rejection message from a given identity, if it is rejected. */
  public identityRejectionFn(identity: AugmentedCompositeIdentity): string {
    if (!identity?.extra?.hasGravity) {
      return 'Player does not have a gravity account. Player will be ignored.';
    }

    return null;
  }
}
