import { Component, OnInit } from '@angular/core';
import { IdentityResultAlphaBatch } from '@models/identity-query.model';
import { Store } from '@ngxs/store';

@Component({
  templateUrl: './sunrise-banning.component.html',
  styleUrls: ['./sunrise-banning.component.scss']
})
export class SunriseBanningComponent implements OnInit {
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
