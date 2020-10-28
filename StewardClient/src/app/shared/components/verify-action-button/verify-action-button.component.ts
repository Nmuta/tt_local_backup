import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { Observable } from 'rxjs';

/** Shared module for verified actions. */
@Component({
  selector: 'verify-action-button',
  templateUrl: './verify-action-button.component.html',
  styleUrls: ['./verify-action-button.component.scss']
})
export class VerifyActionButtonComponent extends BaseComponent {
  /** What to do when the action is confirmed. */
  @Input() public action: () => Observable<any>;

  /** Set to true when this action is possible. */
  @Input() public canSubmit = false;

  /** Text to display inside the button. */
  @Input() public buttonText = "Apply";

  /** Tooltip to display below disabled button. */
  @Input() public verifyText = "Action must be verified";

  /** Tooltip to display below checkbox. */
  @Input() public checkboxText = "Verify";

  public verified = false;
  public isSubmitting = false;
  public submitError: any = undefined;

  constructor() { super(); }

  /** Resets the state of the verification button. */
  public reset() {
    this.verified = false;
  }

  /** Called by the button to initiate the action. */
  public doAction() {
    this.isSubmitting = true;
    this.submitError = false;

    try {
      this.action().subscribe(_ => {
        this.isSubmitting = false;
      },
      error => {
        this.isSubmitting = false;
        this.submitError = error;
      });
    } catch (error) {
      this.isSubmitting = false;
      this.submitError = error;
    }
  }
}
