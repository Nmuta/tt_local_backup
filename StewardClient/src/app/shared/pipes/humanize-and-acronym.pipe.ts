import { Pipe, PipeTransform } from '@angular/core';
import _ from 'lodash';
import { humanize } from './humanize.pipe';

export interface EnumPrintMap {
  enum: string;
  output: string;
}

/**
 * Find each known acronym and capitalize it.
 * Then, transform CamelCase strings to Space Case by leveraging our humanize pipe.
 */
export function humanizeAndHandleAcronyms(value: string): string {
  if (!_.isString(value)) {
    return value;
  }

  let humanized = humanize(value);

  const acronyms: string[] = ['UGC', 'VIN', 'ID'];

  acronyms.forEach(a => {
    let i = humanized.toLocaleLowerCase().indexOf(a.toLocaleLowerCase());

    while (i !== -1) {
      const nextChar = humanized[i + a.length];
      if (!nextChar || !nextChar.match(/[a-zA-Z]/)) {
        humanized = humanized.slice(0, i) + a.toUpperCase() + humanized.slice(i + a.length);
      }
      i = humanized.indexOf(a, i + 1);
    }
  });

  return humanized;
}

/**
 * A pipe to humanize a string, find supported acronyms
 * and capitalize them.
 */
@Pipe({
  name: 'humanizeAndAcronym',
})
export class HumanizeAndAcronymPipe implements PipeTransform {
  /** The transform hook. */
  public transform(value: string): string {
    return humanizeAndHandleAcronyms(value);
  }
}
