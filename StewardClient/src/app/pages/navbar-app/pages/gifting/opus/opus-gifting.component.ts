import { Component, OnInit } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultAlpha, IdentityResultAlphaBatch } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GiftingBaseComponent } from '../base/gifting.base.component';
import { OpusGiftingState } from './state/opus-gifting.state';
import { SetOpusSelectedPlayerIdentities } from './state/opus-gifting.state.actions';

/** The opus gifting page for the Navbar app. */
@Component({
  templateUrl: './opus-gifting.component.html',
  styleUrls: ['./opus-gifting.component.scss'],
})
export class OpusGiftingComponent
  extends GiftingBaseComponent<IdentityResultAlpha>
  implements OnInit {
  @Select(OpusGiftingState.selectedPlayerIdentities) public selectedPlayerIdentities$: Observable<
    IdentityResultAlphaBatch
  >;

  public title: GameTitleCodeName = GameTitleCodeName.FH3;
  public selectedPlayerIdentities: IdentityResultAlphaBatch;
  public disableLspGroupSelection = true; // Opus LSP Groups are not integrated yet

  constructor(protected readonly store: Store) {
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
    this.store.dispatch(new SetOpusSelectedPlayerIdentities(event));
  }

  /** Player identity selected */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public playerIdentitySelected(identity: IdentityResultAlpha): void {
    // Empty
  }

  /** Tracks when the mat tab is changed  */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public matTabSelectionChange(index: number): void {
    throw new Error('LSP Group selection tab is disabled for opus gifting tool.');
  }

  /** Logic when lspgroup selection outputs new value. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onLspGroupChange(event: LspGroup): void {
    throw new Error('LSP Group selection is disabled for opus gifting tool.');
  }
}
