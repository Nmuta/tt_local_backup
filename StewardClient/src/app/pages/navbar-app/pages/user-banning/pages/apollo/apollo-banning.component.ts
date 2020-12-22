import { Component, OnInit } from '@angular/core';
import { IdentityResultAlphaBatch } from '@models/identity-query.model';
import { Store } from '@ngxs/store';

/** The page for banning in apollo. */
@Component({
  templateUrl: './apollo-banning.component.html',
  styleUrls: ['./apollo-banning.component.scss']
})
export class ApolloBanningComponent implements OnInit {
  public selectedPlayerIdentities: IdentityResultAlphaBatch;

  constructor(public readonly store: Store) { }

  /** Init hook. */
  public ngOnInit(): void {
    // this.store.
  }
  public onPlayerIdentitiesChange(results: IdentityResultAlphaBatch) {
    // this.store.dispatch()
  }
}
