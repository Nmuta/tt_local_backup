/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Observable, Subject } from 'rxjs';

/** A base component class. */
@Pipe({ name: 'base-pipe-never-use' })
export abstract class BasePipe implements OnDestroy, PipeTransform {
  protected readonly onDestroy$: Observable<void> = new Subject<void>();

  /** Angular lifecycle hook. */
  public abstract transform(value: any, ...args: any[]): any;

  /** A default on-destroy hook that emits this.onDestroy$ */
  public ngOnDestroy(): void {
    (this.onDestroy$ as Subject<void>).next();
    (this.onDestroy$ as Subject<void>).complete();
  }
}
