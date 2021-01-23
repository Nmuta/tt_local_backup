import { Component, OnInit } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultBeta, IdentityResultBetaBatch } from '@models/identity-query.model';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GiftHistoryBaseComponent } from '../base/gift-history.base.component';
import { GravityGiftHistoryState } from './state/gravity-gift-history.state';
import { SetGravitySelectedPlayerIdentities } from './state/gravity-gift-history.state.actions';

/** The gravity gift history page for the Navbar app. */
@Component({
  templateUrl: './gravity-gift-history.component.html',
  styleUrls: ['./gravity-gift-history.component.scss'],
})
export class GravityGiftHistoryComponent
  extends GiftHistoryBaseComponent<IdentityResultBeta>
  implements OnInit {
  @Select(GravityGiftHistoryState.selectedPlayerIdentities)
  public selectedPlayerIdentities$: Observable<IdentityResultBetaBatch>;

  public title: GameTitleCodeName = GameTitleCodeName.Street;
  public selectedPlayerIdentities: IdentityResultBetaBatch;
  public currentPlayer: IdentityResultBeta;

  constructor(protected readonly store: Store) {
    super();
  }

  /** Initialization hook */
  public ngOnInit(): void {
    this.selectedPlayerIdentities$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((playerIdentities: IdentityResultBetaBatch) => {
        this.selectedPlayerIdentities = playerIdentities;
        this.currentPlayer = this.selectedPlayerIdentities.length > 0 ? this.selectedPlayerIdentities[0] : undefined;
        console.log(this.currentPlayer);
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
