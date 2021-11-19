import { Component, Input } from '@angular/core';

/** Renders a flag with a green check or red cross. Provide the label as <ng-content>. */
@Component({
  selector: 'standard-flag',
  templateUrl: './standard-flag.component.html',
  styleUrls: ['./standard-flag.component.scss'],
})
export class StandardFlagComponent {
  @Input() public value: boolean;
}
