import { Component, OnInit } from '@angular/core';
import { IdentityResultAlphaBatch } from '@models/identity-query.model';
import { Store } from '@ngxs/store';

@Component({
  templateUrl: './opus-banning.component.html',
  styleUrls: ['./opus-banning.component.scss']
})
export class OpusBanningComponent implements OnInit {
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
