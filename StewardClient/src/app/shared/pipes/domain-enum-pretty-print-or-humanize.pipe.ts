import { Pipe, PipeTransform } from '@angular/core';
import _ from 'lodash';
import { DomainEnumPrettyPrintPipe } from './domain-enum-pretty-print.pipe';
import { HumanizePipe } from './humanize.pipe';

export interface EnumPrintMap {
  enum: string;
  output: string;
}

/**
 * A pipe to display enum values with special characters / display requirements.
 * If no special display requirements exist for the input, just humanize.
 */
@Pipe({
  name: 'deppoh',
})
export class DomainEnumPrettyPrintOrHumanizePipe implements PipeTransform {
  private deppPipe = new DomainEnumPrettyPrintPipe();
  private humanizePipe = new HumanizePipe();

  /** The transform hook. */
  public transform(value: string): string {
    if (!_.isString(value)) {
      return value;
    }

    const result = this.deppPipe.transform(value);

    if (result === value) {
      return this.humanizePipe.transform(value);
    }

    return result;
  }
}
