import { GameTitle, UserRole } from '@models/enums';

/** Enum of restricted features. */
export enum V1RestrictedFeature {
  GroupGifting = 'Group Gifting',
  GiftLivery = 'Gift Livery',
  SendLoyaltyRewards = 'Send Loyalty Rewards',
  SetReportWeight = 'Set Report Weight',
  PlayerProfileManagement = 'Manage Player Profiles',
  UserGroupWrite = 'Add and remove users from User Group',
  UserGroupRemoveAll = 'Remove all users from User Group',
}

/** The role restrictions for tooling features. */
export const RestrictedToolAccessLookup = {
  [V1RestrictedFeature.GroupGifting]: {
    [GameTitle.FH5]: [UserRole.LiveOpsAdmin, UserRole.SupportAgentAdmin, UserRole.CommunityManager],
    [GameTitle.FH4]: [UserRole.LiveOpsAdmin, UserRole.SupportAgentAdmin, UserRole.CommunityManager],
    [GameTitle.FM8]: [UserRole.LiveOpsAdmin],
    [GameTitle.FM7]: [UserRole.LiveOpsAdmin, UserRole.SupportAgentAdmin, UserRole.CommunityManager],
  },
  [V1RestrictedFeature.GiftLivery]: {
    [GameTitle.FH5]: [
      UserRole.LiveOpsAdmin,
      UserRole.SupportAgentAdmin,
      UserRole.CommunityManager,
      UserRole.MediaTeam,
    ],
    [GameTitle.FH4]: [
      UserRole.LiveOpsAdmin,
      UserRole.SupportAgentAdmin,
      UserRole.CommunityManager,
      UserRole.MediaTeam,
    ],
    [GameTitle.FM8]: [UserRole.LiveOpsAdmin],
    [GameTitle.FM7]: [
      UserRole.LiveOpsAdmin,
      UserRole.SupportAgentAdmin,
      UserRole.CommunityManager,
      UserRole.MediaTeam,
    ],
  },
  [V1RestrictedFeature.SendLoyaltyRewards]: {
    [GameTitle.FH5]: [
      UserRole.LiveOpsAdmin,
      UserRole.SupportAgentAdmin,
      UserRole.SupportAgent,
      UserRole.CommunityManager,
    ],
    [GameTitle.FH4]: [UserRole.LiveOpsAdmin],
    [GameTitle.FM8]: [UserRole.LiveOpsAdmin],
    [GameTitle.FM7]: [UserRole.LiveOpsAdmin],
  },
  [V1RestrictedFeature.SetReportWeight]: {
    [GameTitle.FH5]: [
      UserRole.LiveOpsAdmin,
      UserRole.SupportAgentAdmin,
      UserRole.SupportAgent,
      UserRole.CommunityManager,
    ],
    [GameTitle.FH4]: [
      UserRole.LiveOpsAdmin,
      UserRole.SupportAgentAdmin,
      UserRole.SupportAgent,
      UserRole.CommunityManager,
    ],
    [GameTitle.FM8]: [
      UserRole.LiveOpsAdmin,
      UserRole.SupportAgentAdmin,
      UserRole.SupportAgent,
      UserRole.CommunityManager,
    ],
    [GameTitle.FM7]: [
      UserRole.LiveOpsAdmin,
      UserRole.SupportAgentAdmin,
      UserRole.SupportAgent,
      UserRole.CommunityManager,
    ],
  },
  [V1RestrictedFeature.PlayerProfileManagement]: {
    [GameTitle.FM8]: [UserRole.LiveOpsAdmin, UserRole.MotorsportDesigner],
    [GameTitle.FH5]: [], // Unused
    [GameTitle.FH4]: [], // Unused
    [GameTitle.FM7]: [], // Unused
  },
  [V1RestrictedFeature.UserGroupWrite]: {
    [GameTitle.FM8]: [
      UserRole.LiveOpsAdmin,
      UserRole.CommunityManager,
      UserRole.MediaTeam,
      UserRole.HorizonDesigner,
    ],
    [GameTitle.FH5]: [
      UserRole.LiveOpsAdmin,
      UserRole.CommunityManager,
      UserRole.MediaTeam,
      UserRole.HorizonDesigner,
    ],
    [GameTitle.FH4]: [
      UserRole.LiveOpsAdmin,
      UserRole.CommunityManager,
      UserRole.MediaTeam,
      UserRole.HorizonDesigner,
    ],
    [GameTitle.FM7]: [
      UserRole.LiveOpsAdmin,
      UserRole.CommunityManager,
      UserRole.MediaTeam,
      UserRole.HorizonDesigner,
    ],
  },
  [V1RestrictedFeature.UserGroupRemoveAll]: {
    [GameTitle.FM8]: [UserRole.LiveOpsAdmin],
    [GameTitle.FH5]: [UserRole.LiveOpsAdmin],
    [GameTitle.FH4]: [UserRole.LiveOpsAdmin],
    [GameTitle.FM7]: [UserRole.LiveOpsAdmin],
  },
};

/** Checks if user role has access to a title's restricted feature. */
export function hasV1AccessToV1RestrictedFeature(
  feature: V1RestrictedFeature,
  title: GameTitle,
  userRole: UserRole,
): boolean {
  // If on V2 auth, this always returns true
  if (userRole === UserRole.GeneralUser) {
    return true;
  }

  // If access list is not available, then the feature is not restricted to certain roles.
  const allowedList: string[] = RestrictedToolAccessLookup[feature][title];
  if (!allowedList) {
    throw new Error(
      `No access list found for restriced feature ${feature} in game title: ${title}`,
    );
  }

  return allowedList.includes(userRole);
}
