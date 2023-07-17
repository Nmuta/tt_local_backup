import { Component, Input } from '@angular/core';

/** Renders a flag with a green check or red cross. Provide the label as <ng-content>. */
@Component({
  selector: 'standard-flag',
  templateUrl: './standard-flag.component.html',
  styleUrls: ['./standard-flag.component.scss'],
})
export class StandardFlagComponent {
  /** REVIEW-COMMENT: Condition for flag. True=green and False=red. */
  @Input() public value: boolean;
}
