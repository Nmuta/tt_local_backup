import { Injectable } from '@angular/core';
import { UserRole } from '@models/enums';
import { UserModel } from '@models/user.model';
import { Store } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';

/** Available tools that have restricted write permissions. */
export enum OldPermissionServiceTool {
  SetUserFlags,
  ConsoleBan,
  UnhideUgc,
  HideUgc,
  FeatureUgc,
  SetUgcGeoFlags,
  Unban,
  CloneUgc,
  PersistUgc,
}

/** Client permission service. */
@Injectable({
  providedIn: 'root',
})
export class OldPermissionsService {
  private readonly writePermissions: Record<OldPermissionServiceTool, UserRole[]> = {
    [OldPermissionServiceTool.SetUserFlags]: [UserRole.LiveOpsAdmin],
    [OldPermissionServiceTool.ConsoleBan]: [UserRole.LiveOpsAdmin],
    [OldPermissionServiceTool.UnhideUgc]: [UserRole.LiveOpsAdmin],
    [OldPermissionServiceTool.HideUgc]: [UserRole.LiveOpsAdmin],
    [OldPermissionServiceTool.FeatureUgc]: [UserRole.LiveOpsAdmin],
    [OldPermissionServiceTool.Unban]: [UserRole.LiveOpsAdmin],
    [OldPermissionServiceTool.SetUgcGeoFlags]: [UserRole.LiveOpsAdmin],
    [OldPermissionServiceTool.CloneUgc]: [UserRole.LiveOpsAdmin, UserRole.GeneralUser],
    [OldPermissionServiceTool.PersistUgc]: [UserRole.LiveOpsAdmin, UserRole.GeneralUser],
  };

  constructor(private readonly store: Store) {}

  /** Checks if user role has write permissions for tool provided. */
  public currentUserHasWritePermission(tool: OldPermissionServiceTool): boolean {
    const profile = this.store.selectSnapshot<UserModel>(UserState.profile);
    const userRole = profile?.role;

    // If on V2 auth, this always returns true
    if (userRole === UserRole.GeneralUser) {
      return true;
    }

    const toolWritePermRoles = this.writePermissions[tool];

    return toolWritePermRoles.includes(userRole);
  }
}
