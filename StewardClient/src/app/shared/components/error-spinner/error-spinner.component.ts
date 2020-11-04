import { Component, Input } from '@angular/core';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

/** A common error + spinner component. */
@Component({
  selector: 'error-spinner',
  templateUrl: './error-spinner.component.html',
  styleUrls: ['./error-spinner.component.scss'],
})
export class ErrorSpinnerComponent {
  /** True while loading / submitting / active. */
  @Input() public isActive = false;

  /** The error received. */
  @Input() public error: any = undefined;

  /** The tooltip to display after an error. */
  @Input() public errorMessage: string = 'Failed';

  /** The tooltip to display while spinning. */
  @Input() public spinnerMessage: string = undefined;

  /** Icon to show on error. */
  public warningIcon = faExclamationTriangle;
}
