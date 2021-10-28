import { Component, Input } from '@angular/core';

type SpinnerSize = 'small' | 'medium' | 'large';

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
  @Input() public error: unknown = undefined;

  /** The tooltip to display after an error. */
  @Input() public errorMessage: string = 'Failed';

  /** The tooltip to display while spinning. */
  @Input() public spinnerMessage: string = undefined;

  /** True while loading / submitting / active. */
  @Input() public size: SpinnerSize = 'small';
}
