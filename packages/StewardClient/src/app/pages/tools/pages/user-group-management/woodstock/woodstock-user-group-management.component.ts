import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitleCodeName } from '@models/enums';
import { LspGroup } from '@models/lsp-group';
import { ParseQueryParamFunctions, QueryParam } from '@models/query-params';
import { Store } from '@ngxs/store';
import { GetLspGroups } from '@shared/state/lsp-group-memory/lsp-group-memory.actions';
import BigNumber from 'bignumber.js';
import { cloneDeep } from 'lodash';
import { takeUntil } from 'rxjs';

/** The Woodstock user group management tool. */
@Component({
  templateUrl: './woodstock-user-group-management.component.html',
  styleUrls: ['./woodstock-user-group-management.component.scss'],
})
export class WoodstockUserGroupManagementComponent extends BaseComponent implements OnInit {
  public preselectedGroupId: BigNumber;
  public formControls = {
    userGroup: new UntypedFormControl('', Validators.required),
  };

  /** Gets the selected user group from form controls. */
  public get selectedUserGroup(): LspGroup {
    return this.formControls.userGroup.value;
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly store: Store,
  ) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    this.preselectedGroupId = ParseQueryParamFunctions[QueryParam.UserGroup](this.route);

    this.formControls.userGroup.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((lspGroup: LspGroup) => {
        if (!lspGroup) {
          this.removeSelectedUserGroup();
          return;
        }

        this.selectUserGroup(lspGroup);
      });
  }

  /** Logic when a new user group is created */
  public newUserGroupCreated(userGroup: LspGroup) {
    this.store
      .dispatch(new GetLspGroups(GameTitleCodeName.FH5, true))
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.formControls.userGroup.setValue(userGroup);
        this.selectUserGroup(userGroup);
      });
  }

  /** Action when a new user group is created. */
  public selectUserGroup(userGroup: LspGroup): void {
    const params = cloneDeep(this.route.snapshot.queryParams);
    params[QueryParam.UserGroup] = userGroup.id.toString();

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }

  /** Removes the selected user group id from query params. */
  private removeSelectedUserGroup(): void {
    const params = cloneDeep(this.route.snapshot.queryParams);
    params[QueryParam.UserGroup] = null;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }
}
