import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { GameTitleCodeName } from '@models/enums';
import { LspGroups } from '@models/lsp-group';
import { Store } from '@ngxs/store';
import { GetLspGroups } from '@shared/state/lsp-group-memory/lsp-group-memory.actions';
import { LspGroupMemoryState } from '@shared/state/lsp-group-memory/lsp-group-memory.state';
import { Observable } from 'rxjs/internal/Observable';
import { LspGroupSelectionBaseComponent } from '../lsp-group-selection.base.component';

/** Steelhead Lsp Group Selection */
@Component({
  selector: 'steelhead-lsp-group-selection',
  templateUrl: '../lsp-group-selection.component.html',
  styleUrls: ['../lsp-group-selection.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SteelheadLspGroupSelectionComponent),
      multi: true,
    },
  ],
})
export class SteelheadLspGroupSelectionComponent extends LspGroupSelectionBaseComponent {
  public title = GameTitleCodeName.FM8;

  constructor(private readonly store: Store) {
    super();
  }

  /** Creates Steelhead's player selection request. */
  public dispatchLspGroupStoreAction(): void {
    this.store.dispatch(new GetLspGroups(GameTitleCodeName.FM8));
  }

  /** Lsp group state property selector */
  public lspGroupSelector(): Observable<LspGroups> {
    return this.store.select(LspGroupMemoryState.steelheadLspGroups);
  }
}
