import { Pipe, PipeTransform } from '@angular/core';
import _ from 'lodash';

export interface EnumPrintMap {
  enum: string;
  output: string;
}

/**
 * Find each known acronym and capitalize it.
 */
export function handleAcronyms(value: string): string {
  if (!_.isString(value)) {
    return value;
  }

  const acronyms: string[] = ['UGC', 'VIN', 'ID'];

  acronyms.forEach(a => {
    let i = value.toLocaleLowerCase().indexOf(a.toLocaleLowerCase());

    while (i !== -1) {
      const nextChar = value[i + a.length];
      if (!nextChar || !nextChar.match(/[a-zA-Z]/)) {
        value = value.slice(0, i) + a.toUpperCase() + value.slice(i + a.length);
      }
      i = value.indexOf(a, i + 1);
    }
  });

  return value;
}

/**
 * A pipe to humanize a string, find supported acronyms
 * and capitalize them.
 */
@Pipe({
  name: 'acronym',
})
export class AcronymPipe implements PipeTransform {
  /** The transform hook. */
  public transform(value: string): string {
    return handleAcronyms(value);
  }
}
