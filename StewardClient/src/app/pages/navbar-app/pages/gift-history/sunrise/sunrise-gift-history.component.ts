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
import { SunriseGiftHistoryState } from './state/sunrise-gift-history.state';
import {
  SetSunriseGiftHistoryMatTabIndex,
  SetSunriseGiftHistorySelectedPlayerIdentities,
} from './state/sunrise-gift-history.state.actions';
import { first } from 'lodash';

/** The gift history page for the Navbar app. */
@Component({
  templateUrl: './sunrise-gift-history.component.html',
  styleUrls: ['./sunrise-gift-history.component.scss'],
})
export class SunriseGiftHistoryComponent
  extends GiftHistoryBaseComponent<IdentityResultAlpha>
  implements OnInit {
  @Select(SunriseGiftHistoryState.selectedPlayerIdentities)
  public selectedPlayerIdentities$: Observable<IdentityResultAlphaBatch>;

  public title: GameTitleCodeName = GameTitleCodeName.FH4;
  public selectedPlayerIdentities: IdentityResultAlphaBatch;
  public selectedLspGroup: LspGroup;
  public selectedPlayer: IdentityResultAlpha;

  constructor(protected readonly store: Store) {
    super();
  }

  /** Initialization hook */
  public ngOnInit(): void {
    const user = this.store.selectSnapshot<UserModel>(UserState.profile);
    this.disableLspGroupSelection = user.role !== 'LiveOpsAdmin';

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
  public onPlayerIdentitiesChange(event: IdentityResultAlphaBatch): void {
    this.store.dispatch(new SetSunriseGiftHistorySelectedPlayerIdentities(event));
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
