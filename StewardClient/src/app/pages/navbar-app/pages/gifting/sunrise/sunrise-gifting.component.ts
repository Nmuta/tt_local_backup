import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultAlphaBatch, IdentityResultAlpha } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { UserModel } from '@models/user.model';
import { Select, Store } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SunriseGiftingState } from './state/sunrise-gifting.state';
import {
  SetSunriseGiftingMatTabIndex,
  SetSunriseGiftingSelectedPlayerIdentities,
} from './state/sunrise-gifting.state.actions';

/** The sunrise gifting page for the Navbar app. */
@Component({
  templateUrl: './sunrise-gifting.component.html',
  styleUrls: ['./sunrise-gifting.component.scss'],
})
export class SunriseGiftingComponent extends BaseComponent implements OnInit {
  @Select(SunriseGiftingState.selectedPlayerIdentities)
  public selectedPlayerIdentities$: Observable<IdentityResultAlphaBatch>;
  public selectedLspGroup$: Observable<LspGroup>;
  public matTabSelectedIndex: number = 0;

  public title: GameTitleCodeName = GameTitleCodeName.FH4;
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
      SunriseGiftingState.selectedMatTabIndex,
    );
    this.selectedPlayerIdentities$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((playerIdentities: IdentityResultAlphaBatch) => {
        this.selectedPlayerIdentities = playerIdentities;
      });
  }

  /** Tracks when the mat tab is changed  */
  public matTabSelectionChange(index: number): void {
    this.store.dispatch(new SetSunriseGiftingMatTabIndex(index));
  }

  /** Logic when player selection outputs identities. */
  public onPlayerIdentitiesChange(event: IdentityResultAlphaBatch): void {
    this.store.dispatch(new SetSunriseGiftingSelectedPlayerIdentities(event));
  }

  /** Logic when lspgroup selection outputs new value. */
  public onLspGroupChange(/* event: LspGroup */): void {
    // Empty
  }

  /** Player identity selected */
  public playerIdentitySelected(identity: IdentityResultAlpha): void {
    if (!!identity) {
      // console.log(`Player has been selected: ${identity.gamertag}`);
    }
  }
}
