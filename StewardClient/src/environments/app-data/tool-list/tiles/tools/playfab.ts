import { GameTitle, UserRole } from '@models/enums';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { HomeTileInfoInternal, AppIcon, NavbarTool, HomeTileRestrictionType } from '../../helpers';

export const playFabTile = <HomeTileInfoInternal>{
  icon: AppIcon.PlayFab,
  tool: NavbarTool.PlayFab,
  accessList: [UserRole.LiveOpsAdmin, UserRole.GeneralUser],
  title: 'PlayFab',
  subtitle: 'Management helpers for PlayFab',
  supportedTitles: [GameTitle.FH5],
  allPermissions: [
    PermAttributeName.ManagePlayFabBuildLocks,
    PermAttributeName.ManagePlayFabSettings,
  ],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'Manage multiplayer server build locks',
  shortDescription: ['Manage multiplayer server build locks'],
  loadChildren: () =>
    import('../../../../../app/pages/tools/pages/playfab/playfab.module').then(
      m => m.PlayFabModule,
    ),
  restriction: {
    requiredPermissions: [PermAttributeName.ManagePlayFabBuildLocks],
    action: HomeTileRestrictionType.Disable,
  },
};
