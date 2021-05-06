import { Directive, Inject, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { BaseDirective } from '@components/base-component/base.directive';
import { isBoolean } from 'lodash';
import { combineLatest } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { DisableStateProvider, STEWARD_DISABLE_STATE_PROVIDER } from './injection-tokens';

/** A hub that coordinates disabled overrides. */
@Directive({
  selector: `
  button[mat-button][stateManager],
  button[mat-raised-button][stateManager],
  button[mat-icon-button][stateManager],
  button[mat-fab][stateManager],
  button[mat-mini-fab][stateManager],
  button[mat-stroked-button][stateManager],
  button[mat-flat-button][stateManager]`,
})
export class ButtonStateManagerDirective extends BaseDirective {
  private disabledByTemplate = false;

  /** The disabled value to use when the monitor is not overriding it. Named to match the default @Inputs. */
  @Input()
  public set disabled(value: boolean) {
    this.disabledByTemplate = value;
    this.updateHostState(this.overrideProviders.map(op => op.overrideDisable));
  }

  constructor(
    private readonly host: MatButton,
    @Inject(STEWARD_DISABLE_STATE_PROVIDER)
    private readonly overrideProviders: DisableStateProvider[],
  ) {
    super();

    this.disabledByTemplate = this.host?.disabled;

    combineLatest(
      overrideProviders.map(op => op.overrideDisable$.pipe(startWith(op.overrideDisable))),
    )
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(v => this.updateHostState(v));
  }

  private updateHostState(v: (boolean | undefined)[]): void {
    const values = v.filter(v => isBoolean(v));
    const anyWantsDisabled = values.some(v => v);
    this.host.disabled = this.disabledByTemplate || anyWantsDisabled;
  }
}
