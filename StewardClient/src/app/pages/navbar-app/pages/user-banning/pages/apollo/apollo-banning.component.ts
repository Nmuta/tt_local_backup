import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

/** Routed Component; Apollo Banning Tool. */
@Component({
  templateUrl: './apollo-banning.component.html',
  styleUrls: ['./apollo-banning.component.scss']
})
export class ApolloBanningComponent {
  public formControls = {
    playerIdentities: new FormControl([], [Validators.required, Validators.minLength(1)]),
    banOptions: new FormControl('', [Validators.required]),
  }

  public formGroup = new FormGroup({
    banOptions: this.formControls.banOptions,
    playerIdentities: this.formControls.playerIdentities,
  });

  /** Submit the form. */
  public submit(): void {
    // const identities = this.formControls.playerIdentities.value as IdentityResultAlphaBatch;
    // const banOptions = this.formControls.banOptions.value as BanOptions;
    // TODO
  }
}
