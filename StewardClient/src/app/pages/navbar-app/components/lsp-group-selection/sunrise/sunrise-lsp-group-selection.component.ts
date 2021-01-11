import { Component } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { LspGroups } from '@models/lsp-group';
import { Store } from '@ngxs/store';
import { GetLspGroups } from '@shared/state/lsp-group-memory/lsp-group-memory.actions';
import { Observable } from 'rxjs';
import { LspGroupSelectionBaseComponent } from '../lsp-group-selection.base.component';

/** Apollo Lsp Group Selection */
@Component({
  selector: 'sunrise-lsp-group-selection',
  templateUrl: '../lsp-group-selection.component.html',
  styleUrls: ['../lsp-group-selection.component.scss'],
  providers: [],
})
export class SunriseLspGroupSelectionComponent extends LspGroupSelectionBaseComponent {
  constructor(public readonly store: Store) {
    super();
  }

  /** Creates Sunrise's player selection request. */
  public makeRequestToGetLspGroups$(): Observable<LspGroups> {
    return this.store.dispatch(new GetLspGroups(GameTitleCodeName.FH4));
  }
}
