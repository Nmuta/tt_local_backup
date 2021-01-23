import { Component, OnInit } from '@angular/core';
import { IdentityResultAlpha, IdentityResultAlphaBatch } from '@models/identity-query.model';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GameTitleCodeName } from '@models/enums';
import { LspGroup } from '@models/lsp-group';
import { Select, Store } from '@ngxs/store';
import { UserModel } from '@models/user.model';
import { UserState } from '@shared/state/user/user.state';
import { GiftHistoryBaseComponent } from '../base/gift-history.base.component';
import { ApolloGiftHistoryState } from './state/apollo-gift-history.state';
import {
  SetApolloGiftHistoryMatTabIndex,
  SetApolloGiftHistorySelectedPlayerIdentities,
} from './state/apollo-gift-history.state.actions';

/** The gift history page for the Navbar app. */
@Component({
  templateUrl: './apollo-gift-history.component.html',
  styleUrls: ['./apollo-gift-history.component.scss']
})
export class ApolloGiftHistoryComponent
extends GiftHistoryBaseComponent<IdentityResultAlpha>
implements OnInit {
  @Select(ApolloGiftHistoryState.selectedPlayerIdentities) public selectedPlayerIdentities$: Observable<
    IdentityResultAlphaBatch>

    public title: GameTitleCodeName = GameTitleCodeName.FM7;
    public selectedPlayerIdentities: IdentityResultAlphaBatch;
    public selectedLspGroup: LspGroup;
    public currentPlayer: IdentityResultAlpha;

    constructor(protected readonly store: Store) {
      super();
    }

  /** Initialization hook */
  public ngOnInit(): void {
    const user = this.store.selectSnapshot<UserModel>(UserState.profile);
    this.disableLspGroupSelection = user.role !== 'LiveOpsAdmin';

    this.matTabSelectedIndex = this.store.selectSnapshot<number>(
      ApolloGiftHistoryState.selectedMatTabIndex,
    );

    this.selectedPlayerIdentities$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((playerIdentities: IdentityResultAlphaBatch) => {
        this.selectedPlayerIdentities = playerIdentities;
        this.currentPlayer = this.selectedPlayerIdentities.length > 0 ? this.selectedPlayerIdentities[0] : undefined;
        console.log(this.currentPlayer);
      });
  }

  /** Tracks when the mat tab is changed  */
  public matTabSelectionChange(index: number): void {
    this.store.dispatch(new SetApolloGiftHistoryMatTabIndex(index));
  }

  /** Logic when player selection outputs identities. */
  public onPlayerIdentitiesChange(event: IdentityResultAlphaBatch): void {
    this.store.dispatch(new SetApolloGiftHistorySelectedPlayerIdentities(event));
  }

  /** Player identity selected */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public playerIdentitySelected(identity: IdentityResultAlpha): void {
    // Empty
  }

  /** Logic when lspgroup selection outputs new value. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onLspGroupChange(event: LspGroup): void {
    // Empty
  }

}
