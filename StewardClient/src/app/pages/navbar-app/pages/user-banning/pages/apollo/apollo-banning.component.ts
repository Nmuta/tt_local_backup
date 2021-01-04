import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IdentityResultAlphaBatch } from '@models/identity-query.model';
import { Store } from '@ngxs/store';
import { BanOptions } from '../../components/ban-options/ban-options.component';

/** The page for banning in apollo. */
@Component({
  templateUrl: './apollo-banning.component.html',
  styleUrls: ['./apollo-banning.component.scss']
})
export class ApolloBanningComponent implements OnInit {
  public selectedPlayerIdentities: IdentityResultAlphaBatch;

  public banOptions: BanOptions;

  public formControls = {
    playerIdentities: new FormControl([], [Validators.required, Validators.minLength(1)]),
    banOptions: new FormControl('', [Validators.required]),
  }

  public formGroup = new FormGroup({
    banOptions: this.formControls.banOptions,
    playerIdentities: this.formControls.playerIdentities,
  });

  constructor(public readonly store: Store) {
    this.formControls.banOptions.valueChanges.subscribe((banOptions: BanOptions) => {
      debugger;
      console.log(banOptions);
    });
    this.formControls.playerIdentities.valueChanges.subscribe((identities: IdentityResultAlphaBatch) => {
      debugger;
      console.log(identities);
    });
  }

  /** Init hook. */
  public ngOnInit(): void {
    // this.store.
  }
  
  public onPlayerIdentitiesChange(results: IdentityResultAlphaBatch) {
    // this.store.dispatch()
  }

  /** Submit the form. */
  public submit() {

  }
}
