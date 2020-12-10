import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { GameTitleCodeNames } from '@models/enums';
import { Select, Store } from '@ngxs/store';
import { UpdatecurrentGiftingPageTitle } from '@shared/state/user/user.actions';
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
    unknown[]
  >;

  title: GameTitleCodeNames = GameTitleCodeNames.FH3;
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
    this.store.dispatch(new SetOpusSelectedPlayerIdentities(event));
  }
}
