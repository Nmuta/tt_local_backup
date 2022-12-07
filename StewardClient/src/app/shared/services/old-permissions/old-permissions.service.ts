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
    [OldPermissionServiceTool.SetUserFlags]: [
      UserRole.LiveOpsAdmin,
      UserRole.SupportAgentAdmin,
      UserRole.SupportAgent,
      UserRole.SupportAgentNew,
      UserRole.CommunityManager,
    ],
    [OldPermissionServiceTool.ConsoleBan]: [
      UserRole.LiveOpsAdmin,
      UserRole.SupportAgentAdmin,
      UserRole.SupportAgent,
      UserRole.SupportAgentNew,
    ],
    [OldPermissionServiceTool.UnhideUgc]: [
      UserRole.LiveOpsAdmin,
      UserRole.SupportAgentAdmin,
      UserRole.SupportAgent,
    ],
    [OldPermissionServiceTool.HideUgc]: [
      UserRole.LiveOpsAdmin,
      UserRole.SupportAgentAdmin,
      UserRole.SupportAgent,
      UserRole.CommunityManager,
    ],
    [OldPermissionServiceTool.FeatureUgc]: [
      UserRole.LiveOpsAdmin,
      UserRole.SupportAgentAdmin,
      UserRole.CommunityManager,
    ],
    [OldPermissionServiceTool.Unban]: [
      UserRole.LiveOpsAdmin,
      UserRole.SupportAgentAdmin,
      UserRole.SupportAgent,
    ],
    [OldPermissionServiceTool.SetUgcGeoFlags]: [
      UserRole.LiveOpsAdmin,
      UserRole.SupportAgentAdmin,
      UserRole.SupportAgent,
    ],
    [OldPermissionServiceTool.CloneUgc]: [
      UserRole.LiveOpsAdmin,
      UserRole.GeneralUser,
      UserRole.HorizonDesigner,
    ],
    [OldPermissionServiceTool.PersistUgc]: [
      UserRole.LiveOpsAdmin,
      UserRole.GeneralUser,
      UserRole.HorizonDesigner,
    ],
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
