import { Pipe, PipeTransform } from '@angular/core';
import BigNumber from 'bignumber.js';

/**
 * A pipe for locale formatting of credits, which are stored as a BigNumber.
 */
@Pipe({
  name: 'bignumber',
})
export class BigNumberPipe implements PipeTransform {
  /** Transform hook. */
  public transform(value: BigNumber | BigInt | number): string {
    if (BigNumber.isBigNumber(value)) {
      return value.toFormat();
    }

    return value.toLocaleString();
  }
}
