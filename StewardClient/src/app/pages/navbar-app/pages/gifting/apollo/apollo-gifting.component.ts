import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SetApolloSelectedPlayerIdentities } from './state/apollo-gifting.state.actions';
import { ApolloGiftingState } from './state/apollo-gifting.state';
import { GameTitleCodeName } from '@models/enums';
import { UpdateCurrentGiftingPageTitle } from '@shared/state/user/user.actions';
import { IdentityResultAlphaBatch } from '@models/identity-query.model';

/** The gifting page for the Navbar app. */
@Component({
  templateUrl: './apollo-gifting.component.html',
  styleUrls: ['./apollo-gifting.component.scss'],
})
export class ApolloGiftingComponent extends BaseComponent implements OnInit {
  @Select(ApolloGiftingState.selectedPlayerIdentities) public selectedPlayerIdentities$: Observable<
    IdentityResultAlphaBatch
  >;

  title: GameTitleCodeName = GameTitleCodeName.FM7;
  selectedPlayerIdentities: IdentityResultAlphaBatch;

  constructor(protected store: Store) {
    super();
  }

  /** Initialization hook */
  public ngOnInit(): void {
    // Required to handle window url changes outside the app
    this.store.dispatch(new UpdateCurrentGiftingPageTitle(this.title));

    this.selectedPlayerIdentities$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((playerIdentities: IdentityResultAlphaBatch) => {
        this.selectedPlayerIdentities = playerIdentities;
      });
  }

  /** Logic when player selection outputs identities. */
  public selectedPlayerIndentities(event: IdentityResultAlphaBatch): void {
    this.store.dispatch(new SetApolloSelectedPlayerIdentities(event));
  }
}
