import { Pipe, PipeTransform } from '@angular/core';
import { isString } from 'lodash';

/**
 * Transform CamelCase strings to Space Case.
 * Based on https://stackoverflow.com/questions/48888648/split-camel-case-string-with-space-using-angularjs-filter
 */
export function humanize(value: string): string {
  if (!isString(value)) {
    return value;
  }

  // https://regexr.com/5f43f
  const split = value.split(/(?=_)|(?=[A-Z_\-](?!(?:[A-Z_\-]|\s|$)))/);
  value = split.join(' ');
  value = value.replace('_', '-');
  value = value[0].toUpperCase() + value.slice(1);

  return value;
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
