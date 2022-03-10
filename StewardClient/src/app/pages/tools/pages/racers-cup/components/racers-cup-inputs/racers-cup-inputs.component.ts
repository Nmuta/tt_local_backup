import { Component, EventEmitter, Output } from '@angular/core';
import { AugmentedCompositeIdentity } from '@views/player-selection/player-selection-base.component';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export type RacersCupCalendarInputs = {
  identity: IdentityResultAlpha;
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
  public identity: IdentityResultAlpha;
  public formControls = {
    daysForward: new FormControl(30, [Validators.required, Validators.min(1)]),
    identity: new FormControl(null, [Validators.required]),
  };

  public calendarScheduleForm: FormGroup = new FormGroup(this.formControls);

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

    this.identity = newIdentity?.steelhead;
    this.formControls.identity.setValue(newIdentity?.steelhead);
  }

  /** Output values for racers cup schedule lookup */
  public submitClicked(): void {
    if (this.identity) {
      this.playerAndDaysForward.emit({
        identity: this.identity,
        daysForward: this.formControls.daysForward.value,
      });
    }
  }
}
