import { Directive, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { BaseDirective } from '@components/base-component/base.directive';
import { isBoolean } from 'lodash';
import { NEVER, Subject } from 'rxjs';
import { catchError, mergeMap, startWith, takeUntil } from 'rxjs/operators';
import { ActionMonitor } from './action-monitor';

/** A directive that disables the button it's attached to while the given monitor is `active`. */
@Directive({
  selector: `button[mat-button][monitor], button[mat-raised-button][monitor], button[mat-icon-button][monitor],
  button[mat-fab][monitor], button[mat-mini-fab][monitor], button[mat-stroked-button][monitor],
  button[mat-flat-button][monitor]`,
})
export class MonitorButtonDirective extends BaseDirective {
  private newValue$ = new Subject<ActionMonitor>();
  private shouldMonitorDisable = false;
  private shouldMonitorWarn = false;
  private monitorIsActive = false;
  private monitorIsErrored = false;

  private disabledByTemplate = false;
  private templateColor = undefined;

  /** Update the monitored value. */
  @Input()
  public set monitor(value: ActionMonitor | null) {
    this.newValue$.next(value);
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
    this.shouldMonitorWarn = isBoolean(value) ? value : true;
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

  constructor(private readonly host: MatButton) {
    super();

    this.newValue$
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
      });

    this.onDestroy$.subscribe({ complete: () => this.newValue$.complete() });
  }

  private updateHostState(): void {
    this.host.disabled =
      this.disabledByTemplate || (this.shouldMonitorDisable && this.monitorIsActive);
    this.host.color = this.shouldMonitorWarn && this.monitorIsErrored ? 'warn' : this.templateColor;
  }
}
