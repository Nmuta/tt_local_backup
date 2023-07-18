import { Directive, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';

/** A base component class. */
@Directive()
export abstract class BaseDirective implements OnDestroy {
  protected readonly onDestroy$: Observable<void> = new Subject<void>();

  /** A default on-destroy hook that emits this.onDestroy$ */
  public ngOnDestroy(): void {
    (this.onDestroy$ as Subject<void>).next();
    (this.onDestroy$ as Subject<void>).complete();
  }
}
