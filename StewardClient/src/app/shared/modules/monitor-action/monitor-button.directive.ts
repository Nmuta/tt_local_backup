import { ComponentType } from '@angular/cdk/portal';
import { Directive, forwardRef, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HCI } from '@environments/environment';
import { isBoolean, isObject } from 'lodash';
import { STEWARD_DISABLE_STATE_PROVIDER } from '../state-managers/injection-tokens';
import { ErrorSnackbarComponent } from './error-snackbar/error-snackbar.component';
import { MonitorBaseDirective } from './monitor.base.directive';
import { SuccessSnackbarComponent } from './success-snackbar/success-snackbar.component';

/** A directive that disables the button it's attached to while the given monitor is `active`. */
@Directive({
  selector: `button[mat-button][monitor], button[mat-raised-button][monitor], button[mat-icon-button][monitor], button[mat-fab][monitor], button[mat-mini-fab][monitor], button[mat-stroked-button][monitor], button[mat-flat-button][monitor], button[mat-button][monitor][monitorWarn], button[mat-button][monitor][monitorWarnSnackbar], button[mat-button][monitor][monitorCompleteSnackbar], button[mat-button][monitor][monitorDisable], button[mat-button][monitor][waitOnMonitors], button[mat-raised-button][monitor][monitorWarn], button[mat-raised-button][monitor][monitorWarnSnackbar], button[mat-raised-button][monitor][monitorCompleteSnackbar], button[mat-raised-button][monitor][monitorDisable], button[mat-raised-button][monitor][waitOnMonitors], button[mat-icon-button][monitor][monitorWarn], button[mat-icon-button][monitor][monitorWarnSnackbar], button[mat-icon-button][monitor][monitorCompleteSnackbar], button[mat-icon-button][monitor][monitorDisable], button[mat-icon-button][monitor][waitOnMonitors], button[mat-fab][monitor][monitorWarn], button[mat-fab][monitor][monitorWarnSnackbar], button[mat-fab][monitor][monitorCompleteSnackbar], button[mat-fab][monitor][monitorDisable], button[mat-fab][monitor][waitOnMonitors], button[mat-mini-fab][monitor][monitorWarn], button[mat-mini-fab][monitor][monitorWarnSnackbar], button[mat-mini-fab][monitor][monitorCompleteSnackbar], button[mat-mini-fab][monitor][monitorDisable], button[mat-mini-fab][monitor][waitOnMonitors], button[mat-stroked-button][monitor][monitorWarn], button[mat-stroked-button][monitor][monitorWarnSnackbar], button[mat-stroked-button][monitor][monitorCompleteSnackbar], button[mat-stroked-button][monitor][monitorDisable], button[mat-stroked-button][monitor][waitOnMonitors], button[mat-flat-button][monitor][monitorWarn], button[mat-flat-button][monitor][monitorWarnSnackbar], button[mat-flat-button][monitor][monitorCompleteSnackbar], button[mat-flat-button][monitor][monitorDisable], button[mat-flat-button][monitor][waitOnMonitors]`,
  providers: [
    {
      provide: STEWARD_DISABLE_STATE_PROVIDER,
      useExisting: forwardRef(() => MonitorButtonDirective),
      multi: true,
    },
  ],
})
export class MonitorButtonDirective extends MonitorBaseDirective {
  private shouldMonitorDisable = false;
  private shouldMonitorWarnWithColor = false;
  private shouldMonitorWarnWithSnackbar = false;
  private shouldMonitorCompleteWithSnackbar = false;

  private templateColor = undefined;
  private alternateCompleteSnackbarComponent: ComponentType<unknown> = undefined;

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
  public set monitorCompleteSnackbar(value: '' | ComponentType<unknown>) {
    this.shouldMonitorCompleteWithSnackbar = isBoolean(value) ? value : true;
    this.alternateCompleteSnackbarComponent = isObject(value) ? value : undefined;
    this.updateHostState();
  }

  /** When set, produces a snackbar indicating the error when the monitor state is `error`. */
  @Input()
  public set monitorWarnSnackbar(value: boolean | '') {
    this.shouldMonitorWarnWithSnackbar = isBoolean(value) ? value : true;
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
  }

  /**
   * Called when the primary monitor for this component is changed.
   * Use this to emit snackbars, change button color after failure/success, etc.
   */
  protected onPrimaryMonitorChange(): void {
    this.updateHostState();
    this.produceSnackBar();
  }

  /**
   * Called when any secondary monitor for this component is changed.
   * Use this to disable the component while other controls are active.
   */
  protected onSecondaryMonitorChange(): void {
    this.updateHostState();
  }

  private updateHostState(): void {
    if (!this.monitor) {
      return;
    }

    const anyMonitorActive = this.monitorIsActive || this.otherMonitorIsActive;
    this.updateHostDisabledState(this.shouldMonitorDisable && anyMonitorActive);

    const targetColor =
      this.shouldMonitorWarnWithColor && this.monitorIsErrored ? 'warn' : this.templateColor;
    this.host.color = targetColor;
  }

  private produceSnackBar(): void {
    if (this.monitorIsErrored && this.shouldMonitorWarnWithSnackbar) {
      this.snackBar.openFromComponent(ErrorSnackbarComponent, {
        data: this.monitor,
        panelClass: ['snackbar-warn'],
        duration: HCI.Toast.Duration.Standard,
      });
    }

    if (this.monitorIsComplete && this.shouldMonitorCompleteWithSnackbar) {
      if (this.alternateCompleteSnackbarComponent) {
        this.snackBar.openFromComponent(this.alternateCompleteSnackbarComponent, {
          data: this.monitor,
          panelClass: ['snackbar-success'],
          duration: HCI.Toast.Duration.Standard,
        });
      } else {
        this.snackBar.openFromComponent(SuccessSnackbarComponent, {
          data: this.monitor,
          panelClass: ['snackbar-success'],
          duration: HCI.Toast.Duration.Standard,
        });
      }
    }
  }
}
