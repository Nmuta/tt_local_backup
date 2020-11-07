import { Pipe, PipeTransform } from '@angular/core';

/**
 * A pipe for locale formatting of credits, which are stored as a BigInt.
 */
@Pipe({
  name: 'bignumber'
})
export class BigNumberPipe implements PipeTransform {
  /** Transform hook. */
  public transform(value: BigInt | number): string {
    console.log("numbaaaaa ", value);
    return value.toLocaleString();
  }
}
