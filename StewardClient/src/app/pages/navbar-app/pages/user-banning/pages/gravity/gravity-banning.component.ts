import { Component, OnInit } from '@angular/core';
import { IdentityResultBetaBatch } from '@models/identity-query.model';
import { Store } from '@ngxs/store';

@Component({
  templateUrl: './gravity-banning.component.html',
  styleUrls: ['./gravity-banning.component.scss']
})
export class GravityBanningComponent implements OnInit {
  public selectedPlayerIdentities: IdentityResultBetaBatch;

  constructor(public readonly store: Store) { }

  /** Init hook. */
  public ngOnInit(): void {
    // this.store.
  }
  
  public onPlayerIdentitiesChange(results: IdentityResultBetaBatch) {
    // this.store.dispatch()
  }
}
