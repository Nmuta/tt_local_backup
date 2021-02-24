import { Component, OnInit } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultBeta, IdentityResultBetaBatch } from '@models/identity-query.model';
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
export class GravityGiftingComponent
  extends GiftingBaseComponent<IdentityResultBeta>
  implements OnInit {
  @Select(GravityGiftingState.selectedPlayerIdentities)
  public selectedPlayerIdentities$: Observable<IdentityResultBetaBatch>;

  /** Game title. */
  public title: GameTitleCodeName = GameTitleCodeName.Street;
  /** All selected player identities from player selection tool. */
  public selectedPlayerIdentities: IdentityResultBetaBatch;
  /** Selected player identity when user clicks on identity chip. */
  public selectedPlayerIdentity: IdentityResultBeta;

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
  public onPlayerIdentitiesChange(event: IdentityResultBetaBatch): void {
    this.store.dispatch(new SetGravitySelectedPlayerIdentities(event));
  }

  /** Player identity selected */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public playerIdentitySelected(identity: IdentityResultBeta): void {
    // Empty
  }
}
