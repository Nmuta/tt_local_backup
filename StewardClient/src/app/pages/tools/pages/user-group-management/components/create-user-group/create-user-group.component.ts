import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { LspGroup } from '@models/lsp-group';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { delay, Observable, takeUntil } from 'rxjs';

export interface CreateUserGroupServiceContract {
  createUserGroup$(groupName: string): Observable<LspGroup>;
}

/** Tool that creates new user groups. */
@Component({
  selector: 'create-user-group',
  templateUrl: './create-user-group.component.html',
  styleUrls: ['./create-user-group.component.scss'],
})
export class CreateUserGroupComponent extends BaseComponent implements OnChanges {
  /** Service contract for create user group component. */
  @Input() service: CreateUserGroupServiceContract;
  /** Outputs when a new user group is created */
  @Output() newUserGroup = new EventEmitter<LspGroup>();

  public monitor = new ActionMonitor('Create new user group');
  public formControls = {
    groupName: new FormControl(null, Validators.required),
  };
  public formGroup = new FormGroup(this.formControls);

  /** Initialization hook */
  public ngOnChanges(): void {
    if (!this.service) {
      throw new Error('No service contract was provided for CreateUserGroupComponent');
    }
  }

  /** Creates a new LSP user group. */
  public createUserGroup(): void {
    if (this.monitor.isActive) {
      return;
    }

    this.monitor = this.monitor.repeat();

    this.service
      .createUserGroup$(this.formControls.groupName.value)
      .pipe(delay(3_000), this.monitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(newUserGroup => {
        this.formControls.groupName.setValue(null);
        this.newUserGroup.emit(newUserGroup);
      });
  }
}
