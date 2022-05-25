import { Injectable } from '@angular/core';
import { UserRole } from '@models/enums';
import { UserModel } from '@models/user.model';
import { Store } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';

/** Available tools that have restricted write permissions. */
export enum PermissionServiceTool {
  SetUserFlags,
  ConsoleBan,
  UnhideUgc,
  HideUgc,
  FeatureUgc,
  Unban,
}

/** Client permission service. */
@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  private readonly writePermissions: Record<PermissionServiceTool, UserRole[]> = {
    [PermissionServiceTool.SetUserFlags]: [
      UserRole.LiveOpsAdmin,
      UserRole.SupportAgentAdmin,
      UserRole.SupportAgent,
      UserRole.SupportAgentNew,
    ],
    [PermissionServiceTool.ConsoleBan]: [
      UserRole.LiveOpsAdmin,
      UserRole.SupportAgentAdmin,
      UserRole.SupportAgent,
      UserRole.SupportAgentNew,
    ],
    [PermissionServiceTool.UnhideUgc]: [
      UserRole.LiveOpsAdmin,
      UserRole.SupportAgentAdmin,
      UserRole.SupportAgent,
    ],
    [PermissionServiceTool.HideUgc]: [
      UserRole.LiveOpsAdmin,
      UserRole.SupportAgentAdmin,
      UserRole.SupportAgent,
      UserRole.CommunityManager,
    ],
    [PermissionServiceTool.FeatureUgc]: [
      UserRole.LiveOpsAdmin,
      UserRole.SupportAgentAdmin,
      UserRole.SupportAgent,
      UserRole.CommunityManager,
    ],
    [PermissionServiceTool.Unban]: [UserRole.LiveOpsAdmin, UserRole.SupportAgentAdmin],
  };

  constructor(private readonly store: Store) {}

  /** Checks if user role has write permissions for tool provided. */
  public currentUserHasWritePermission(tool: PermissionServiceTool): boolean {
    const profile = this.store.selectSnapshot<UserModel>(UserState.profile);
    const userRole = profile?.role;
    const toolWritePermRoles = this.writePermissions[tool];

    return toolWritePermRoles.includes(userRole);
  }
}
