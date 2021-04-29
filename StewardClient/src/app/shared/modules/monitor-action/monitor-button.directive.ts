import { Directive, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseDirective } from '@components/base-component/base.directive';
import { isBoolean } from 'lodash';
import { NEVER, Subject } from 'rxjs';
import { catchError, mergeMap, startWith, takeUntil } from 'rxjs/operators';
import { ActionMonitor } from './action-monitor';
import { ErrorSnackbarComponent } from './error-snackbar/error-snackbar.component';

/** A directive that disables the button it's attached to while the given monitor is `active`. */
@Directive({
  selector: `button[mat-button][monitor], button[mat-raised-button][monitor], button[mat-icon-button][monitor],
  button[mat-fab][monitor], button[mat-mini-fab][monitor], button[mat-stroked-button][monitor],
  button[mat-flat-button][monitor],
  button[mat-button][monitor][monitorWarn], button[mat-raised-button][monitor][monitorWarn], button[mat-icon-button][monitor][monitorWarn],
  button[mat-fab][monitor][monitorWarn], button[mat-mini-fab][monitor][monitorWarn], button[mat-stroked-button][monitor][monitorWarn],
  button[mat-flat-button][monitor][monitorWarn],
  button[mat-button][monitor][monitorWarnSnackbar], button[mat-raised-button][monitor][monitorWarnSnackbar], button[mat-icon-button][monitor][monitorWarnSnackbar],
  button[mat-fab][monitor][monitorWarnSnackbar], button[mat-mini-fab][monitor][monitorWarnSnackbar], button[mat-stroked-button][monitor][monitorWarnSnackbar],
  button[mat-flat-button][monitor][monitorWarnSnackbar],
  button[mat-button][monitor][monitorDisable], button[mat-raised-button][monitor][monitorDisable], button[mat-icon-button][monitor][monitorDisable],
  button[mat-fab][monitor][monitorDisable], button[mat-mini-fab][monitor][monitorDisable], button[mat-stroked-button][monitor][monitorDisable],
  button[mat-flat-button][monitor][monitorDisable]`,
})
export class MonitorButtonDirective extends BaseDirective {
  private _monitor: ActionMonitor = undefined;
  private monitor$ = new Subject<ActionMonitor>();
  private shouldMonitorDisable = false;
  private shouldMonitorWarnWithColor = false;
  private shouldMonitorWarnWithSnackbar = false;
  private monitorIsActive = false;
  private monitorIsErrored = false;

  private disabledByTemplate = false;
  private templateColor = undefined;

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

  /** When set, disables the host component when the monitor state is `active`. */
  @Input()
  public set monitorDisable(value: boolean | '') {
    this.shouldMonitorDisable = isBoolean(value) ? value : true;
    this.updateHostState();
  }

  /** When set, changes the button's color to 'warn' when the monitor state is `error`. */
  @Input()
  public set monitorWarn(value: boolean | '') {
    this.shouldMonitorWarnWithColor = isBoolean(value) ? value : true;
    this.updateHostState();
  }

  /** When set, produces a snackbar indicating the error when the monitor state is `error`. */
  @Input()
  public set monitorWarnSnackbar(value: boolean | '') {
    this.shouldMonitorWarnWithSnackbar = isBoolean(value) ? value : true;
    this.updateHostState();
  }

  /** The disabled value to use when the monitor is not overriding it. Named to match the default @Inputs. */
  @Input()
  public set disabled(value: boolean) {
    this.disabledByTemplate = value;
    this.updateHostState();
  }

  /** The color value to use when the monitor is not overriding it. Named to match the Angular Material theme @Inputs. */
  @Input()
  public set color(value: string) {
    this.templateColor = value;
    this.updateHostState();
  }

  constructor(private readonly host: MatButton, private readonly snackBar: MatSnackBar) {
    super();

    this.monitor$
      .pipe(
        mergeMap(v =>
          v
            ? v.status$.pipe(
                startWith(v.status),
                catchError(() => NEVER),
              )
            : NEVER,
        ),
        takeUntil(this.onDestroy$),
      )
      .subscribe(v => {
        this.monitorIsActive = v ? v.state === 'active' : false;
        this.monitorIsErrored = v ? v.state === 'error' : false;
        this.updateHostState();
        this.produceSnackBar();
      });

    this.onDestroy$.subscribe({ complete: () => this.monitor$.complete() });
  }

  private updateHostState(): void {
    this.host.disabled =
      this.disabledByTemplate || (this.shouldMonitorDisable && this.monitorIsActive);
    this.host.color =
      this.shouldMonitorWarnWithColor && this.monitorIsErrored ? 'warn' : this.templateColor;
  }

  private produceSnackBar(): void {
    if (this.monitorIsErrored && this.shouldMonitorWarnWithSnackbar) {
      this.snackBar.openFromComponent(ErrorSnackbarComponent, {
        data: this.monitor,
        panelClass: ['snackbar-warn'],
      });
    }
  }
}
