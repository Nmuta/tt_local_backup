import { Component, Input } from '@angular/core';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

/** Displays the value sent on `input` as a json blob. */
@Component({
  selector: 'json-dump',
  templateUrl: './json-dump.component.html',
  styleUrls: ['./json-dump.component.scss'],
})
export class JsonDumpComponent {
  @Input() public input: unknown;

  public readonly copyIcon = faCopy;
}
