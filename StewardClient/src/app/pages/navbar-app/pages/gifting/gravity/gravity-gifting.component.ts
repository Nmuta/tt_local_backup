import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { GameTitleCodeNames } from '@models/enums';
import { Select, Store } from '@ngxs/store';
import { UpdatecurrentGiftingPageTitle } from '@shared/state/user/user.actions';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GravityGiftingState } from './state/gravity-gifting.state';
import { SetGravitySelectedPlayerIdentities } from './state/gravity-gifting.state.actions';

/** The gravity gifting page for the Navbar app. */
@Component({
  templateUrl: './gravity-gifting.component.html',
  styleUrls: ['./gravity-gifting.component.scss'],
})
export class GravityGiftingComponent extends BaseComponent implements OnInit {
  @Select(GravityGiftingState.selectedPlayerIdentities)
  public selectedPlayerIdentities$: Observable<unknown[]>;

  title: GameTitleCodeNames = GameTitleCodeNames.Street;
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
    this.store.dispatch(new SetGravitySelectedPlayerIdentities(event));
  }
}
