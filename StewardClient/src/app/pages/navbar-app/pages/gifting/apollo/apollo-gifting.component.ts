import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SetApolloSelectedPlayerIdentities } from './state/apollo-gifting.state.actions';
import { ApolloGiftingState } from './state/apollo-gifting.state';
import { GameTitleCodeNames } from '@models/enums';
import { UpdatecurrentGiftingPageTitle } from '@shared/state/user/user.actions';

/** The gifting page for the Navbar app. */
@Component({
  templateUrl: './apollo-gifting.component.html',
  styleUrls: ['./apollo-gifting.component.scss'],
})
export class ApolloGiftingComponent extends BaseComponent implements OnInit {
  @Select(ApolloGiftingState.selectedPlayerIdentities) public selectedPlayerIdentities$: Observable<
    unknown[]
  >;

  title: GameTitleCodeNames = GameTitleCodeNames.FM7;
  selectedPlayerIdentities: unknown[];

  constructor(protected store: Store) {
    super();
  }

  /** Initialization hook */
  public ngOnInit(): void {
    // Required to handle window url changes outside the app
    this.store.dispatch(new UpdatecurrentGiftingPageTitle(this.title));

    this.selectedPlayerIdentities$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((playerIdentities: unknown[]) => {
        this.selectedPlayerIdentities = playerIdentities;
      });
  }

  /** Logic when player selection outputs identities. */
  public selectedPlayerIndentities(event: unknown[]): void {
    this.store.dispatch(new SetApolloSelectedPlayerIdentities(event));
  }
}
