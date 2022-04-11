import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';

/** A base component class. */
@Injectable()
export abstract class BaseService implements OnDestroy {
  protected readonly onDestroy$: Observable<void> = new Subject<void>();

  /** A default on-destroy hook that emits this.onDestroy$ */
  public ngOnDestroy(): void {
    (this.onDestroy$ as Subject<void>).next();
    (this.onDestroy$ as Subject<void>).complete();
  }
}
