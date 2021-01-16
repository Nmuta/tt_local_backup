import { Component } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';

/** Routed component; Opus Banning Tool. */
@Component({
  templateUrl: './opus-banning.component.html',
  styleUrls: ['./opus-banning.component.scss'],
})
export class OpusBanningComponent {
  public formControls = {
    playerIdentities: new FormControl([], [Validators.required, Validators.minLength(1)]),
    banOptions: new FormControl('', [Validators.required]),
  };

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
