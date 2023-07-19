import { Pipe, PipeTransform } from '@angular/core';
import { jsonBigIntSafeSerialize } from '@helpers/json-bigint';

/** Like angular's native `json` pipe, but now with support for big ints. */
@Pipe({
  name: 'bigjson',
})
export class BigJsonPipe implements PipeTransform {
  /** Transform hook. */
  public transform(value: unknown): string {
    return jsonBigIntSafeSerialize(value, '  ');
  }
}
