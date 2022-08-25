import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { isArray } from 'lodash';

type TemplateName = 'array' | 'unknown';

/** Displays the value sent on `input` as a json blob. */
@Component({
  selector: 'json-dump',
  templateUrl: './json-dump.component.html',
  styleUrls: ['./json-dump.component.scss'],
})
export class JsonDumpComponent implements OnChanges {
  @Input() public input: unknown;

  /** The input as an array, if it is one. */
  public get inputArray(): unknown[] {
    return isArray(this.input) ? this.input : null;
  }

  public template: TemplateName = 'unknown';

  /** Angular lifecycle hook. */
  public ngOnChanges(_changes: SimpleChanges) {
    this.template = this.determineTemplate();
  }

  private determineTemplate(): TemplateName {
    if (isArray(this.input)) {
      return 'array';
    }

    return 'unknown';
  }
}
