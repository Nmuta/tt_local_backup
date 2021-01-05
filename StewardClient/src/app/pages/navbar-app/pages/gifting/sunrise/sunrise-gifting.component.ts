import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultAlphaBatch } from '@models/identity-query.model';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SunriseGiftingState } from './state/sunrise-gifting.state';
import { SetSunriseSelectedPlayerIdentities } from './state/sunrise-gifting.state.actions';

/** The sunrise gifting page for the Navbar app. */
@Component({
  templateUrl: './sunrise-gifting.component.html',
  styleUrls: ['./sunrise-gifting.component.scss'],
})
export class SunriseGiftingComponent extends BaseComponent implements OnInit {
  @Select(SunriseGiftingState.selectedPlayerIdentities)
  public selectedPlayerIdentities$: Observable<IdentityResultAlphaBatch>;

  title: GameTitleCodeName = GameTitleCodeName.FH4;
  selectedPlayerIdentities: IdentityResultAlphaBatch;

  constructor(protected store: Store) {
    super();
  }

  /** Initialization hook */
  public ngOnInit(): void {
    this.selectedPlayerIdentities$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((playerIdentities: IdentityResultAlphaBatch) => {
        this.selectedPlayerIdentities = playerIdentities;
      });
  }

  /** Logic when player selection outputs identities. */
  public onPlayerIdentitiesChange(event: IdentityResultAlphaBatch): void {
    this.store.dispatch(new SetSunriseSelectedPlayerIdentities(event));
  }
}
