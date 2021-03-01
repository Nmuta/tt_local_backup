import { Component, OnInit } from '@angular/core';
import { IdentityResultAlpha, IdentityResultAlphaBatch } from '@models/identity-query.model';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GameTitleCodeName } from '@models/enums';
import { LspGroup } from '@models/lsp-group';
import { Select, Store } from '@ngxs/store';
import { GiftHistoryBaseComponent } from '../base/gift-history.base.component';
import { SunriseGiftHistoryState } from './state/sunrise-gift-history.state';
import {
  SetSunriseGiftHistoryMatTabIndex,
  SetSunriseGiftHistorySelectedPlayerIdentities,
} from './state/sunrise-gift-history.state.actions';
import { first } from 'lodash';
import { AugmentedCompositeIdentity } from '@navbar-app/components/player-selection/player-selection-base.component';

/** The gift history page for the Navbar app. */
@Component({
  templateUrl: './sunrise-gift-history.component.html',
  styleUrls: ['./sunrise-gift-history.component.scss'],
})
export class SunriseGiftHistoryComponent
  extends GiftHistoryBaseComponent
  implements OnInit {
  @Select(SunriseGiftHistoryState.selectedPlayerIdentities)
  public selectedPlayerIdentities$: Observable<IdentityResultAlphaBatch>;

  public title: GameTitleCodeName = GameTitleCodeName.FH4;
  public selectedPlayerIdentities: IdentityResultAlphaBatch;
  /** Selected player identity when user clicks on identity chip. */
  public selectedPlayerIdentity: IdentityResultAlpha;
  public selectedLspGroup: LspGroup;
  public selectedPlayer: IdentityResultAlpha;

  constructor(protected readonly store: Store) {
    super();
  }

  /** Initialization hook */
  public ngOnInit(): void {
    this.matTabSelectedIndex = this.store.selectSnapshot<number>(
      SunriseGiftHistoryState.selectedMatTabIndex,
    );

    this.selectedPlayerIdentities$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((playerIdentities: IdentityResultAlphaBatch) => {
        this.selectedPlayerIdentities = playerIdentities;
        this.selectedPlayer = first(this.selectedPlayerIdentities);
      });
  }

  /** Tracks when the mat tab is changed  */
  public matTabSelectionChange(index: number): void {
    this.store.dispatch(new SetSunriseGiftHistoryMatTabIndex(index));
  }

  /** Logic when player selection outputs identities. */
  public onPlayerIdentityChange(identity: AugmentedCompositeIdentity): void {
    const newIdentity = identity?.extra?.hasSunrise ? identity.sunrise : null;
    this.store.dispatch(new SetSunriseGiftHistorySelectedPlayerIdentities([newIdentity]));
  }

  /** Player identity selected */
  public playerIdentitySelected(identity: AugmentedCompositeIdentity): void {
    this.selectedPlayerIdentity = identity?.extra?.hasSunrise ? identity.sunrise : null;
  }
}
