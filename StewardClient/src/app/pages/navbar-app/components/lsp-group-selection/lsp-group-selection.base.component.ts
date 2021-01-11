import { Component } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { Observable } from 'rxjs';
import { LspGroups } from '@models/lsp-group';

/** The shared top-level navbar. */
@Component({
  template: '',
})
export abstract class LspGroupSelectionBaseComponent extends BaseComponent {
  /** True while waiting on a request. */
  public isLoading = false;
  /** The error received while loading. */
  public loadError: unknown;

  constructor() {
    super();
  }

  /** Child(title) class should implement. */
  public abstract makeRequestToGetLspGroups$(): Observable<LspGroups>;
}
