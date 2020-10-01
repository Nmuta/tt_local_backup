import { Component, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';

/** A base component class. */
@Component({ template: '' })
export abstract class BaseComponent implements OnDestroy {
  protected readonly onDestroy$: Observable<void> = new Subject<void>();

  /** A default on-destroy hook that emits this.onDestroy$ */
  public ngOnDestroy(): void {
    (this.onDestroy$ as Subject<void>).next();
    (this.onDestroy$ as Subject<void>).complete();
  }
}
