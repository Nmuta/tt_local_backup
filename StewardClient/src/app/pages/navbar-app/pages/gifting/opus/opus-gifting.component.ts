import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultAlphaBatch } from '@models/identity-query.model';
import { Select, Store } from '@ngxs/store';
import { UpdateCurrentGiftingPageTitle } from '@shared/state/user/user.actions';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OpusGiftingState } from './state/opus-gifting.state';
import { SetOpusSelectedPlayerIdentities } from './state/opus-gifting.state.actions';

/** The opus gifting page for the Navbar app. */
@Component({
  templateUrl: './opus-gifting.component.html',
  styleUrls: ['./opus-gifting.component.scss'],
})
export class OpusGiftingComponent extends BaseComponent implements OnInit {
  @Select(OpusGiftingState.selectedPlayerIdentities) public selectedPlayerIdentities$: Observable<
    IdentityResultAlphaBatch
  >;

  title: GameTitleCodeName = GameTitleCodeName.FH3;
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
    this.store.dispatch(new SetOpusSelectedPlayerIdentities(event));
  }
}
