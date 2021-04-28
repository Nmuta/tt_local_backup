import { Component, Input } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { Observable } from 'rxjs';

/** Shared module for verified actions. */
@Component({
  selector: 'verify-action-button',
  templateUrl: './verify-action-button.component.html',
  styleUrls: ['./verify-action-button.component.scss'],
})
export class VerifyActionButtonComponent extends BaseComponent {
  /** What to do when the action is confirmed. */
  @Input() public action: () => Observable<unknown>;

  /** Caller should set to true when this action is possible. */
  @Input() public canSubmit = false;

  /** Caller should populate this with the reason submit is disabled. */
  @Input() public canSubmitDisabledReason = 'Action is disabled';

  /** When set to true, will not auto-hide the component. */
  @Input() public alwaysShow = false;

  /** Text to display inside the button. */
  @Input() public buttonText = 'Apply';

  /** Tooltip to display below disabled button. */
  @Input() public verifyText = 'Action must be verified';

  /** Tooltip to display beside checkbox. */
  @Input() public checkboxText = '';

  /** Tooltip to display over submittable button. */
  @Input() public tooltip: string = null;

  public verified = false;
  public isSubmitting = false;
  public submitError: unknown = undefined;

  constructor() {
    super();
  }

  /** Returns the tooltip that should be used. */
  public get activeTooltip(): string {
    if (!this.canSubmit) {
      return this.canSubmitDisabledReason;
    }

    if (!this.verified) {
      return this.verifyText;
    }

    return this.tooltip;
  }

  /** Resets the state of the verification button. */
  public reset(): void {
    this.verified = false;
  }

  /** Called by the button to initiate the action. */
  public doAction(): void {
    this.isSubmitting = true;
    this.submitError = false;

    try {
      this.action().subscribe(
        _ => {
          this.isSubmitting = false;
        },
        error => {
          this.isSubmitting = false;
          this.submitError = error;
        },
      );
    } catch (error) {
      this.isSubmitting = false;
      this.submitError = error;
    }
  }
}
