import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { BetterSimpleChanges } from '@helpers/simple-changes';
import { GameTitle } from '@models/enums';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { isEqual } from 'lodash';
import { Observable, takeUntil } from 'rxjs';
import { ToggleListOptions } from '../toggle-list/toggle-list.component';

/** Contract for using Toggle List EZ. */
export interface ToggleListEzContract {
  order: string[];
  initialModel: ToggleListOptions;
  submitModel$(alteredModel: ToggleListOptions): Observable<void>;
  title: string;
  gameTitle: GameTitle;
  permAttribute?: PermAttributeName;
  error?: string;
}

/** Component for easier integration with toggle-list form component in common scenarios. */
@Component({
  selector: 'toggle-list-ez',
  templateUrl: './toggle-list-ez.component.html',
  styleUrls: ['./toggle-list-ez.component.scss'],
})
export class ToggleListEzComponent extends BaseComponent implements OnChanges {
  /** Fired after Submit is pressed, the contract function is called, and the data is synced. */
  @Output() public afterSubmitted = new EventEmitter<ToggleListOptions>();
  /** The service contract for this component. */
  @Input() public contract: ToggleListEzContract;
  @Input() public set disabled(value: boolean) {
    value ? this.formControl.disable() : this.formControl.enable();
  }

  public submitMonitor = new ActionMonitor('Submit Toggle List');
  public formControl = new UntypedFormControl();

  constructor() {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnChanges(_changes: BetterSimpleChanges<ToggleListEzComponent>) {
    this.formControl.valueChanges.subscribe(v => {
      if (isEqual(v, this.contract.initialModel)) {
        this.formControl.reset();
      }
    });

    this.validateContract(this.contract);
    this.syncContract(this.contract);
  }

  /** Resets the form control. */
  public resetToInitial(): void {
    this.formControl.setValue(this.contract.initialModel);
    this.formControl.reset();
  }

  /** Triggers submit */
  public submit(): void {
    if (this.submitMonitor.isActive) {
      throw new Error('Double submit');
    }

    this.submitMonitor = this.submitMonitor.repeat();
    this.contract
      .submitModel$(this.formControl.value)
      .pipe(this.submitMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.afterSubmitted.next(this.formControl.value);
      });
  }

  private syncContract(contract: ToggleListEzContract) {
    if (this.submitMonitor.isActive) {
      throw new Error('Cannot sync contract mid-submission');
    }

    this.submitMonitor = new ActionMonitor(`Submit ${contract.title}`);
    this.resetToInitial();
  }

  private validateContract(contract: ToggleListEzContract) {
    if (!contract?.initialModel) {
      throw new Error('No initial model on contract');
    }

    if (!contract?.submitModel$) {
      throw new Error('No submit function on contract');
    }

    if (!contract?.order) {
      throw new Error('No order on contract');
    }

    if (!contract?.title) {
      throw new Error('No title on contract');
    }
  }
}
