import { Pipe, PipeTransform } from '@angular/core';
import { JSONBigInt } from '@helpers/json-bigint';
import { Observable } from 'rxjs';

/** Like angular's native `json` pipe, but now with support for big ints. */
@Pipe({
  name: 'bigjson',
})
export class BigJsonPipe implements PipeTransform {
  /** Transform hook. */
  public transform(value: unknown): string {
    const cache = [];
    const removeCircularAndObservable = (_key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (cache.includes(value)) {
          return '[Circular]';
        }
        cache.push(value);
      }

      if (value instanceof Observable) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return `[Observable (s${(value as any).observers?.length})]`;
      }

      return value;
    };

    return JSONBigInt.stringify(value, removeCircularAndObservable, '  ');
  }
}
