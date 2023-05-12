import { Pipe, PipeTransform } from '@angular/core';
import { isString } from 'lodash';
import { AcronymPipe } from './acronym.pipe';

/**
 * Transform CamelCase strings to Space Case.
 * Based on https://stackoverflow.com/questions/48888648/split-camel-case-string-with-space-using-angularjs-filter
 */
export function humanize(value: string): string {
  if (!value || !isString(value)) {
    return value;
  }

  const acronymPipe = new AcronymPipe();

  // https://regexr.com/5f43f
  const split = value.split(/(?=_)|(?=[A-Z_\-](?!(?:[A-Z_\-]|\s|$)))/);
  value = split.join(' ');
  value = value.replace('_', '-');
  value = value[0].toUpperCase() + value.slice(1);

  const acronymized = acronymPipe.transform(value);

  return acronymized;
}

/**
 * A pipe to transform CamelCase to Space Case.
 * Based on https://stackoverflow.com/questions/48888648/split-camel-case-string-with-space-using-angularjs-filter
 */
@Pipe({
  name: 'humanize',
})
export class HumanizePipe implements PipeTransform {
  /** The transform hook. */
  public transform(value: string): string {
    return humanize(value);
  }
}
