import { GameTitle, UserRole } from '@models/enums';

/** Enum of restricted features. */
export enum RestrictedFeature {
  GroupGifting = 'Group Gifting',
  GiftLivery = 'Gift Livery',
  SendLoyaltyRewards = 'Send Loyalty Rewards',
}

/** The role restrictions for tooling features. */
export const RestrictedToolAccessLookup = {
  [RestrictedFeature.GroupGifting]: {
    [GameTitle.FH5]: [UserRole.LiveOpsAdmin, UserRole.SupportAgentAdmin, UserRole.CommunityManager],
    [GameTitle.FH4]: [UserRole.LiveOpsAdmin, UserRole.SupportAgentAdmin, UserRole.CommunityManager],
    [GameTitle.FM8]: [UserRole.LiveOpsAdmin],
    [GameTitle.FM7]: [UserRole.LiveOpsAdmin, UserRole.SupportAgentAdmin, UserRole.CommunityManager],
  },
  [RestrictedFeature.GiftLivery]: {
    [GameTitle.FH5]: [UserRole.LiveOpsAdmin, UserRole.SupportAgentAdmin, UserRole.CommunityManager],
    [GameTitle.FH4]: [UserRole.LiveOpsAdmin, UserRole.SupportAgentAdmin, UserRole.CommunityManager],
    [GameTitle.FM8]: [UserRole.LiveOpsAdmin],
    [GameTitle.FM7]: [UserRole.LiveOpsAdmin, UserRole.SupportAgentAdmin, UserRole.CommunityManager],
  },
  [RestrictedFeature.SendLoyaltyRewards]: {
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
};

/** Checks if user role has access to a title's restricted feature. */
export function hasAccessToRestrictedFeature(
  feature: RestrictedFeature,
  title: GameTitle,
  userRole: UserRole,
): boolean {
  // If access list is not available, then the feature is not restricted to certain roles.
  const allowedList: string[] = RestrictedToolAccessLookup[feature][title];
  if (!allowedList) {
    throw new Error(
      `No access list found for restriced feature ${feature} in game title: ${title}`,
    );
  }

  return allowedList.includes(userRole);
}
