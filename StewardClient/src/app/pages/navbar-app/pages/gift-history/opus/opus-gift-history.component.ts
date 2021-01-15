import { Component, OnInit } from '@angular/core';
import { IdentityResultAlpha, IdentityResultAlphaBatch } from '@models/identity-query.model';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GameTitleCodeName } from '@models/enums';
import { Select, Store } from '@ngxs/store';
import { UserModel } from '@models/user.model';
import { UserState } from '@shared/state/user/user.state';
import { GiftHistoryBaseComponent } from '../base/gift-history.base.component';
import { OpusGiftHistoryState } from './state/opus-gift-history.state';
import { SetOpusGiftHistorySelectedPlayerIdentities } from './state/opus-gift-history.state.actions';

/** The gift history page for the Navbar app. */
@Component({
  templateUrl: './opus-gift-history.component.html',
  styleUrls: ['./opus-gift-history.component.scss']
})
export class OpusGiftHistoryComponent
extends GiftHistoryBaseComponent<IdentityResultAlpha>
implements OnInit {
  @Select(OpusGiftHistoryState.selectedPlayerIdentities) public selectedPlayerIdentities$: Observable<
    IdentityResultAlphaBatch>

    public title: GameTitleCodeName = GameTitleCodeName.FM7;
    public selectedPlayerIdentities: IdentityResultAlphaBatch;

    constructor(protected readonly store: Store) {
      super();
    }

  /** Initialization hook */
  public ngOnInit(): void {
    const user = this.store.selectSnapshot<UserModel>(UserState.profile);
    this.disableLspGroupSelection = user.role !== 'LiveOpsAdmin';

    this.matTabSelectedIndex = this.store.selectSnapshot<number>(
      OpusGiftHistoryState.selectedMatTabIndex,
    );

    this.selectedPlayerIdentities$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((playerIdentities: IdentityResultAlphaBatch) => {
        this.selectedPlayerIdentities = playerIdentities;
      });
  }

  /** Logic when player selection outputs identities. */
  public onPlayerIdentitiesChange(event: IdentityResultAlphaBatch): void {
    this.store.dispatch(new SetOpusGiftHistorySelectedPlayerIdentities(event));
  }

  /** Player identity selected */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public playerIdentitySelected(identity: IdentityResultAlpha): void {
    // Empty
  }
}
