import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  SetApolloGiftingMatTabIndex,
  SetApolloGiftingSelectedPlayerIdentities,
} from './state/apollo-gifting.state.actions';
import { ApolloGiftingState } from './state/apollo-gifting.state';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultAlpha, IdentityResultAlphaBatch } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { UserModel } from '@models/user.model';
import { UserState } from '@shared/state/user/user.state';

/** The gifting page for the Navbar app. */
@Component({
  templateUrl: './apollo-gifting.component.html',
  styleUrls: ['./apollo-gifting.component.scss'],
})
export class ApolloGiftingComponent extends BaseComponent implements OnInit {
  @Select(ApolloGiftingState.selectedPlayerIdentities) public selectedPlayerIdentities$: Observable<
    IdentityResultAlphaBatch
  >;

  public matTabSelectedIndex: number = 0;

  public title: GameTitleCodeName = GameTitleCodeName.FM7;
  public selectedPlayerIdentities: IdentityResultAlphaBatch;
  public selectedLspGroup: LspGroup;

  public disableLspGroupSelection: boolean = true;

  constructor(protected readonly store: Store) {
    super();
  }

  /** Initialization hook */
  public ngOnInit(): void {
    const user = this.store.selectSnapshot<UserModel>(UserState.profile);
    this.disableLspGroupSelection = user.role !== 'LiveOpsAdmin';

    this.matTabSelectedIndex = this.store.selectSnapshot<number>(
      ApolloGiftingState.selectedMatTabIndex,
    );
    this.selectedPlayerIdentities$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((playerIdentities: IdentityResultAlphaBatch) => {
        this.selectedPlayerIdentities = playerIdentities;
      });
  }

  /** Logic when player selection outputs identities. */
  public onPlayerIdentitiesChange(event: IdentityResultAlphaBatch): void {
    this.store.dispatch(new SetApolloGiftingSelectedPlayerIdentities(event));
  }

  /** Player identity selected */
  public playerIdentitySelected(identity: IdentityResultAlpha): void {
    if (!!identity) {
      // console.log(`Player has been selected: ${identity.gamertag}`);
    }
  }

  /** Tracks when the mat tab is changed  */
  public matTabSelectionChange(index: number): void {
    this.store.dispatch(new SetApolloGiftingMatTabIndex(index));
  }

  /** Logic when lspgroup selection outputs new value. */
  public onLspGroupChange(/* event: LspGroup */): void {
    // Empty
  }
}
