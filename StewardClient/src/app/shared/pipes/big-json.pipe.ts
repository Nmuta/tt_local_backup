import { Pipe, PipeTransform } from '@angular/core';
import * as JSONBig from 'json-bigint';

const JSONAlwaysBig = JSONBig({ alwaysParseAsBig: true, useNativeBigInt: true });

/** Like angular's native `json` pipe, but now with support for big ints. */
@Pipe({
  name: 'bigjson'
})
export class BigJsonPipe implements PipeTransform {
  /** Transform hook. */
  public transform(value: any): unknown {
    return JSONAlwaysBig.stringify(value, null, '  ');
  }
}
