import { Directive, Inject, Input } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { BaseDirective } from '@components/base-component/base.directive';
import { isBoolean } from 'lodash';
import { combineLatest } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { STEWARD_DISABLE_STATE_PROVIDER, DisableStateProvider } from './injection-tokens';

/** A hub that coordinates disabled overrides. */
@Directive({
  selector: 'mat-checkbox[stateManager]',
})
export class CheckboxStateManagerDirective extends BaseDirective {
  private disabledByTemplate = false;

  /** The disabled value to use when the monitor is not overriding it. Named to match the default @Inputs. */
  @Input()
  public set disabled(value: boolean) {
    this.disabledByTemplate = value;
    this.updateHostState(this.overrideProviders.map(op => op.overrideDisable));
  }

  constructor(
    private readonly host: MatCheckbox,
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
