import { Pipe, PipeTransform } from '@angular/core';
import { BasePipe } from '@components/base-component/base.pipe';
import { Observable, timer } from 'rxjs';
import { delay, distinct, map, takeUntil } from 'rxjs/operators';
import { BigJsonPipe } from './big-json.pipe';

/** An asynchronous version of the json pipe which recalculates the stringified value constantly. */
@Pipe({
  name: 'bigjson$',
})
export class AsyncBigJsonPipe extends BasePipe implements PipeTransform {
  /** Transform hook. */
  public transform(value: unknown, interval: number = 1_000 /*ms*/): Observable<string> {
    return timer(0, interval).pipe(
      map(() => new BigJsonPipe().transform(value)),
      distinct(),
      delay(0),
      takeUntil(this.onDestroy$),
    );
  }
}
