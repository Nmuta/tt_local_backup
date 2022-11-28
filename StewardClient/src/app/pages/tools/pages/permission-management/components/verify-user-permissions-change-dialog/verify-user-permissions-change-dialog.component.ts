import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { UserModel } from '@models/user.model';
import { PermissionsService } from '@services/api-v2/permissions/permissions.service';
import { PermAttribute, PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { find } from 'lodash';
import { catchError, EMPTY, takeUntil } from 'rxjs';

export interface VerifyUserPermissionChangeDialogData {
  currentPerms: PermAttribute[];
  updatedPerms: PermAttribute[];
  user: UserModel;
}

interface VerifyPermissionChangeEntryTitle {
  title: GameTitle;
  environments: string[];
}

interface VerifyPermissionChangeEntry {
  attribute: PermAttributeName;
  titles: VerifyPermissionChangeEntryTitle[];
}

/**
 *  Verifies updated user perms before saving to DB.
 */
@Component({
  selector: 'verify-user-permissions-change-dialog',
  templateUrl: 'verify-user-permissions-change-dialog.component.html',
  styleUrls: ['verify-user-permissions-change-dialog.component.scss'],
})
export class VerifyUserPermissionChangeDialogComponent extends BaseComponent implements OnInit {
  public savePermissionsMonitor = new ActionMonitor('POST save user permissions');
  public newPermsList: PermAttribute[];
  public addedPermissions: VerifyPermissionChangeEntry[];
  public removedPermissions: VerifyPermissionChangeEntry[];

  public user: UserModel;

  constructor(
    public readonly permissionsService: PermissionsService,
    public dialogRef: MatDialogRef<VerifyUserPermissionChangeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VerifyUserPermissionChangeDialogData,
  ) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    this.user = this.data.user;
    this.newPermsList = this.data.updatedPerms;
    this.addedPermissions = this.findPermDifferences(this.data.currentPerms, this.data.updatedPerms);
    this.removedPermissions = this.findPermDifferences(this.data.updatedPerms, this.data.currentPerms);
  }

  /** Sets featured status. */
  public saveUpdatedPermissions(): void {
    this.savePermissionsMonitor = this.savePermissionsMonitor.repeat();
    this.dialogRef.disableClose = true;

    this.permissionsService
      .setUserPermissionAttributes$(this.user, this.newPermsList)
      .pipe(
        this.savePermissionsMonitor.monitorSingleFire(),
        catchError(() => EMPTY),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => {
        this.dialogRef.disableClose = false;
        this.dialogRef.close();
      });
  }

  private findPermDifferences(
    source: PermAttribute[],
    changes: PermAttribute[],
  ): VerifyPermissionChangeEntry[] {
    const diffs: VerifyPermissionChangeEntry[] = [];

    for (const change of changes) {
      const isDiff = !find(source, {
        attribute: change.attribute,
        title: change.title,
        environment: change.environment,
      });

      if (isDiff) {
        const existingChangeEntry = find(diffs, { attribute: change.attribute });
        if (!!existingChangeEntry) {
          const titleEntry = find(existingChangeEntry.titles, {
            title: change.title,
          }) as VerifyPermissionChangeEntryTitle;
          if (!!titleEntry) {
            titleEntry.environments.push(change.environment);
          } else {
            existingChangeEntry.titles.push({
              title: change.title,
              environments: [change.environment],
            } as VerifyPermissionChangeEntryTitle);
          }
        } else {
          let titles: VerifyPermissionChangeEntryTitle[] = [];
          if (change.title !== '') {
            titles = [
              {
                title: change.title,
                environments: [change.environment],
              } as VerifyPermissionChangeEntryTitle,
            ];
          }

          diffs.push({
            attribute: change.attribute,
            titles: titles,
          } as VerifyPermissionChangeEntry);
        }
      }
    }

    return diffs;
  }
}
