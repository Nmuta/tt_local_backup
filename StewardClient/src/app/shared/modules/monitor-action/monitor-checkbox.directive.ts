import { Directive, forwardRef, Input } from '@angular/core';
import { isBoolean } from 'lodash';
import { STEWARD_DISABLE_STATE_PROVIDER } from '../state-managers/injection-tokens';
import { MonitorBaseDirective } from './monitor.base.directive';

/** A directive that disables the checkbox it's attached to while the given monitor is `active`. */
@Directive({
  selector: `mat-checkbox[monitor], mat-checkbox[monitor][waitOnMonitors]`,
  providers: [
    {
      provide: STEWARD_DISABLE_STATE_PROVIDER,
      useExisting: forwardRef(() => MonitorCheckboxDirective),
      multi: true,
    },
  ],
})
export class MonitorCheckboxDirective extends MonitorBaseDirective {
  private shouldMonitorDisable = true;

  /** When set, disables the host component when the monitor state is `active`. */
  @Input()
  public set monitorDisable(value: boolean | '') {
    this.shouldMonitorDisable = isBoolean(value) ? value : true;
    this.updateHostState();
  }

  /**
   * Called when the primary monitor for this component is changed.
   * Use this to emit snackbars, change button color after failure/success, etc.
   */
  protected onPrimaryMonitorChange(): void {
    this.updateHostState();
  }

  /**
   * Called when any secondary monitor for this component is changed.
   * Use this to disable the component while other controls are active.
   */
  protected onSecondaryMonitorChange(): void {
    this.updateHostState();
  }

  private updateHostState(): void {
    const anyMonitorActive = this.monitorIsActive || this.otherMonitorIsActive;
    this.updateHostDisabledState(this.shouldMonitorDisable && anyMonitorActive);
  }
}
