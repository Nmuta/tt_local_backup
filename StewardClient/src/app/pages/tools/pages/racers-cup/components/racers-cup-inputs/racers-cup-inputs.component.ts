import { Component, EventEmitter, Output } from '@angular/core';
import { AugmentedCompositeIdentity } from '@views/player-selection/player-selection-base.component';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PegasusPathInfo } from '@models/pegasus-path-info';

export type RacersCupCalendarInputs = {
  identity?: IdentityResultAlpha;
  pegasusInfo?: PegasusPathInfo;
  daysForward: number;
};

/**Inputs for Racers Cup Calendar. */
@Component({
  selector: 'racers-cup-inputs',
  templateUrl: './racers-cup-inputs.component.html',
  styleUrls: ['./racers-cup-inputs.component.scss'],
})
export class RacersCupInputsComponent {
  @Output() public playerAndDaysForward = new EventEmitter<RacersCupCalendarInputs>();
  public matTabSelectedIndex = 0;

  public identityFormControls = {
    daysForward: new FormControl(30, [Validators.required, Validators.min(1)]),
    identity: new FormControl(null, [Validators.required]),
  };
  public identityCalendarScheduleForm: FormGroup = new FormGroup(this.identityFormControls);

  public pegasusFormControls = {
    daysForward: new FormControl(30, [Validators.required, Validators.min(1)]),
    pegasusEnvironment: new FormControl(null, [Validators.required]),
    pegasusSlot: new FormControl(null),
    pegasusSnapshot: new FormControl(null),
  };
  public pegasusCalendarScheduleForm: FormGroup = new FormGroup(this.pegasusFormControls);

  /** Produces a rejection message from a given identity, if it is rejected. */
  public identityRejectionFn(identity: AugmentedCompositeIdentity): string {
    if (!identity?.extra?.hasSteelhead) {
      return 'Player does not have a steelhead account at the selected endpoint. Player will be ignored.';
    }

    return null;
  }

  /** Player identity selected */
  public playerIdentityFound(newIdentity: AugmentedCompositeIdentity): void {
    if (newIdentity?.steelhead?.error) {
      return;
    }

    this.identityFormControls.identity.setValue(newIdentity?.steelhead);
  }

  /** Output values for racers cup schedule lookup */
  public submitClicked(): void {
    // Using identity lookup
    if (this.matTabSelectedIndex == 0) {
      if (this.identityFormControls.identity) {
        this.playerAndDaysForward.emit({
          identity: this.identityFormControls.identity.value,
          daysForward: this.identityFormControls.daysForward.value,
        });
      }
    }
    // Using Pegasus lookup
    else if (this.matTabSelectedIndex == 1) {
      const info: PegasusPathInfo = {
        environment: this.pegasusFormControls.pegasusEnvironment.value,
        slot: this.pegasusFormControls.pegasusSlot.value,
        snapshot: this.pegasusFormControls.pegasusSnapshot.value,
      };
      this.playerAndDaysForward.emit({
        pegasusInfo: info,
        daysForward: this.pegasusFormControls.daysForward.value,
      });
    }
  }
}
