import { Pipe, PipeTransform } from '@angular/core';
import { BasePipe } from '@components/base-component/base.pipe';
import { delay, Observable, ReplaySubject } from 'rxjs';

/** Waits until after the next render step to output the value. Produces an observable. */
@Pipe({ name: 'renderGuard$' })
export class RenderGuardAsyncPipe extends BasePipe implements PipeTransform {
  private readonly replay = new ReplaySubject(1);
  private readonly output = this.replay.pipe(delay(0));

  constructor() {
    super();
    this.onDestroy$.subscribe(() => this.replay.complete());
  }

  /** Delays the value. */
  public transform<T>(value: T): Observable<T> {
    this.replay.next(value);
    return this.output as Observable<T>;
  }
}
