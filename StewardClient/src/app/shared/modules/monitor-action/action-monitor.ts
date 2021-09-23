import { cloneDeep, last } from 'lodash';
import { DateTime } from 'luxon';
import { BehaviorSubject, MonoTypeOperatorFunction, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ActionStatus } from './action-status';

type ActionMonitorMode = 'single-fire' | 'multi-fire';

/**
 * Constructs an action monitor.
 *
 * Works in one of two modes:
 * 1. Single Fire
 * 2. Multi Fire
 *
 * Single Fire:
 * - Use monitor.monitorSingleFire() as an rxjs pipe in a single location
 * - Monitoring is started when the pipe function is generated
 * - Receive values on monitor.status or monitor.status$
 * - State starts as `active`
 *
 * Multi Fire:
 * - Use monitor.monitorStart() as an rxjs pipe before the request
 * - Use monitor.monitorEnd() as an rxjs pipe after the request
 * - Monitoring is started when the monitor.monitorStart() pipe is generated
 * - State starts as `inactive`
 */
export class ActionMonitor {
  private static readonly DEFAULT_STATUS: ActionStatus<unknown> = {
    dates: undefined,
    error: undefined,
    mode: undefined,
    state: 'inactive',
    value: undefined,
  };

  private _status$ = new BehaviorSubject<ActionStatus<unknown>>(ActionMonitor.DEFAULT_STATUS);
  private _allStatuses: ActionStatus<unknown>[] = [];
  private mode: ActionMonitorMode = null;

  /** The current status of the action. */
  public get status(): ActionStatus<unknown> {
    return last(this._allStatuses) || ActionMonitor.DEFAULT_STATUS;
  }

  /** Gets all historic statuses. */
  public get allStatuses(): ActionStatus<unknown>[] {
    return this._allStatuses;
  }

  /** Observable that is fired each time the status updates. */
  public get status$(): Observable<ActionStatus<unknown>> {
    return this._status$;
  }

  /** Returns whether monitor is currently active. */
  public get isActive(): boolean {
    return this.status.state === 'active';
  }

  constructor(public readonly label: string = 'UNLABELED') {}

  /** Produces the RXJS operator for monitoring a single-fire action. */
  public monitorSingleFire<T>(): MonoTypeOperatorFunction<T> {
    this.setMode('single-fire');
    this.initializeStatus({
      error: undefined,
      value: undefined,
      state: 'active',
      mode: this.mode,
      dates: {
        lastStart: DateTime.local(),
        lastEnd: undefined,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    return function (source$: Observable<T>): Observable<T> {
      return source$.pipe(
        tap({
          next: next => self.onValue(next),
          error: error => self.onError(error),
          complete: () => self.onComplete(),
        }),
      );
    };
  }

  /** Produces the RXJS operator for monitoring the start of a multi-fire action. */
  public monitorStart<T>(): MonoTypeOperatorFunction<T> {
    this.setMode('multi-fire');
    this.initializeStatus({
      error: undefined,
      value: undefined,
      state: 'inactive',
      mode: this.mode,
      dates: {
        lastStart: undefined,
        lastEnd: undefined,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    return function (source$: Observable<T>): Observable<T> {
      return source$.pipe(
        tap({
          next: _next => self.onValueStart(),
        }),
      );
    };
  }

  /** Produces the RXJS operator for monitoring the end of a multi-fire action. */
  public monitorEnd<T>(): MonoTypeOperatorFunction<T> {
    this.setMode('multi-fire');

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    return function (source$: Observable<T>): Observable<T> {
      return source$.pipe(
        tap({
          next: next => self.onValueEnd(next),
          error: error => self.onError(error),
          complete: () => self.onComplete(),
        }),
      );
    };
  }

  /** Call to perform cleanup. */
  public dispose(): ActionMonitor {
    this._status$.complete();
    return this;
  }

  private onValueStart(): void {
    this.setMode('multi-fire');
    this.updateStatus(s => {
      s.value = null;
      s.state = 'active';
      s.error = null;
      s.dates.lastStart = DateTime.local();
      s.dates.lastEnd = null;
    });
  }

  private onValueEnd<T>(next: T): void {
    this.setMode('multi-fire');
    this.updateStatus(s => {
      s.value = next;
      s.state = 'inactive';
      s.error = null;
      s.dates.lastEnd = DateTime.local();
    });
  }

  private onValue<T>(next: T): void {
    this.setMode('single-fire');
    this.updateStatus(s => {
      s.value = next;
      s.state = 'inactive';
      s.error = null;
    });
  }

  /** Fired when the observable terminates in an error. */
  private onError(error: unknown): void {
    this.updateStatus(s => {
      s.value = null;
      s.error = error;
      s.state = 'error';
      s.dates.lastEnd = DateTime.local();
    });
    this._status$.error(error);
  }

  /** Fired when the observable terminates successfully. */
  private onComplete(): void {
    this.updateStatus(s => {
      s.state = 'complete';
      s.dates.lastEnd = DateTime.local();
    });
    this._status$.complete();
  }

  private initializeStatus<T>(status: ActionStatus<T>) {
    if (this._allStatuses.length > 0) {
      throw new Error('Tried to initialize ActionMonitor Status more than once.');
    }

    this._allStatuses.push(status);
    this._status$.next(status);
  }

  /** Immutably updates an existing status object. */
  private updateStatus(
    visitor: (lastStatus: ActionStatus<unknown>) => void,
  ): ActionStatus<unknown> {
    const newStatus = cloneDeep(this.status);
    visitor(newStatus);
    this._allStatuses.push(newStatus);
    this._status$.next(newStatus);
    return newStatus;
  }

  /** Updates the mode. Produces an error if attempting to use in multiple modes. */
  private setMode(mode: ActionMonitorMode): void {
    if (!!mode) {
      this.mode = mode;
    }

    if (this.mode !== mode) {
      throw new Error(`Cannot use ActionMonitor in '${mode}' mode. Current mode is '${this.mode}'`);
    }
  }
}
