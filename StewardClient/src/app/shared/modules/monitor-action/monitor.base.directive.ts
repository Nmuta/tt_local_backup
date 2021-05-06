import { Directive, Input } from '@angular/core';
import { BaseDirective } from '@components/base-component/base.directive';
import { isArray, isEmpty } from 'lodash';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { mergeMap, startWith, takeUntil } from 'rxjs/operators';
import { DisableStateProvider } from '../state-managers/injection-tokens';
import { ActionMonitor } from './action-monitor';
import { ActionStatus } from './action-status';

/** A base directive for ActionMonitors */
@Directive()
export abstract class MonitorBaseDirective extends BaseDirective implements DisableStateProvider {
  public overrideDisable: boolean = undefined;
  public overrideDisable$ = new BehaviorSubject<boolean | undefined>(this.overrideDisable);

  protected monitorIsActive = false;
  protected monitorIsErrored = false;
  protected monitorIsComplete = false;
  protected otherMonitorIsActive = false;

  private _monitor: ActionMonitor = undefined;
  private monitor$ = new BehaviorSubject<ActionMonitor>(this._monitor);
  private _waitOnMonitors: ActionMonitor[] = undefined;
  private waitOnMonitors$ = new BehaviorSubject<ActionMonitor[]>(this._waitOnMonitors);

  /** Update the monitored value. */
  @Input()
  public set monitor(value: ActionMonitor | null) {
    this._monitor = value;
    this.monitor$.next(value);
  }

  /** Get the monitored value. */
  public get monitor(): ActionMonitor | null {
    return this._monitor;
  }

  /** Set monitors this button should wait to complete. */
  @Input()
  public set waitOnMonitors(value: ActionMonitor[] | null) {
    this._waitOnMonitors = value || [];
    this.waitOnMonitors$.next(this._waitOnMonitors);
  }

  /** Get the monitors this button should wait to complete. */
  public get waitOnMonitors(): ActionMonitor[] | null {
    return this._waitOnMonitors;
  }

  constructor() {
    super();

    this.waitOnMonitors$
      .pipe(
        takeUntil(this.onDestroy$),
        mergeMap(otherMonitors => {
          let otherStatuses$: Observable<ActionStatus<unknown>[]> = of([]);
          if (isArray(otherMonitors)) {
            otherStatuses$ = combineLatest([
              ...otherMonitors.map(om => om.status$.pipe(startWith(om.status))),
            ]);
          }

          return otherStatuses$;
        }),
      )
      .subscribe(otherStatuses => {
        this.otherMonitorIsActive = otherStatuses.some(m => m.state === 'active');
        this.onSecondaryMonitorChange();
      });

    this.monitor$
      .pipe(
        takeUntil(this.onDestroy$),
        mergeMap(monitor => {
          if (!monitor) {
            return of(undefined as ActionStatus<undefined>);
          }

          return monitor.status$.pipe(startWith(monitor.status));
        }),
      )
      .subscribe(status => {
        this.monitorIsActive = status ? status.state === 'active' : false;
        this.monitorIsErrored = status ? status.state === 'error' : false;
        this.monitorIsComplete = status ? status.state === 'complete' : false;
        this.onPrimaryMonitorChange();
      });
  }

  /**
   * Called when the primary monitor for this component is changed.
   * Use this to emit snackbars, change button color after failure/success, etc.
   */
  protected abstract onPrimaryMonitorChange(): void;

  /**
   * Called when any secondary monitor for this component is changed.
   * Use this to disable the component while other controls are active.
   */
  protected abstract onSecondaryMonitorChange(): void;

  /**
   * Call this to update the disabled state of the host button safely.
   * Must also have an `overrideManager` attached to the component.
   */
  protected updateHostDisabledState(newState: boolean | undefined): void {
    this.overrideDisable = newState;
    this.overrideDisable$.next(this.overrideDisable);
    if (this.monitor && isEmpty(this.overrideDisable$.observers)) {
      throw new Error(
        'updateHostDisabledState called when there were no active subscribers. Probably a missing stateManager directive.',
      );
    }
  }
}
