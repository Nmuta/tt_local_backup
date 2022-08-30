import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { hasAccessToRestrictedFeature, RestrictedFeature } from '@environments/environment';
import { GameTitle } from '@models/enums';
import { LspGroup } from '@models/lsp-group';
import { UserModel } from '@models/user.model';
import { Store } from '@ngxs/store';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { UserState } from '@shared/state/user/user.state';
import { delay, Observable, takeUntil } from 'rxjs';

export interface CreateUserGroupServiceContract {
  gameTitle: GameTitle;
  createUserGroup$(groupName: string): Observable<LspGroup>;
}

/** Tool that creates new user groups. */
@Component({
  selector: 'create-user-group',
  templateUrl: './create-user-group.component.html',
  styleUrls: ['./create-user-group.component.scss'],
})
export class CreateUserGroupComponent extends BaseComponent implements OnChanges, OnInit {
  /** Service contract for create user group component. */
  @Input() service: CreateUserGroupServiceContract;
  /** Outputs when a new user group is created */
  @Output() newUserGroup = new EventEmitter<LspGroup>();

  public userHasWritePerms: boolean = false;
  public readonly incorrectPermsTooltip = 'This action is restricted for your user role';
  public monitor = new ActionMonitor('Create new user group');
  public formControls = {
    groupName: new FormControl(null, Validators.required),
  };
  public formGroup = new FormGroup(this.formControls);

  constructor(private readonly store: Store) {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    const user = this.store.selectSnapshot<UserModel>(UserState.profile);
    this.userHasWritePerms = hasAccessToRestrictedFeature(
      RestrictedFeature.UserGroupWrite,
      this.service.gameTitle,
      user.role,
    );
  }

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
