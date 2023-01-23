import { GameTitle } from '@models/enums';
import { HomeTileInfoInternal, AppIcon, NavbarTool, CommonAccessLevels } from '../../helpers';

export const userGroupManagementTile = <HomeTileInfoInternal>{
  icon: AppIcon.UserGroupManagement,
  tool: NavbarTool.UserGroupManagement,
  accessList: CommonAccessLevels.UserGroupManagement,
  title: 'User Group Management',
  subtitle: 'Create & Edit User Groups',
  supportedTitles: [GameTitle.FH4, GameTitle.FH5, GameTitle.FM7, GameTitle.FM8],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'Manage all operations for user groups.',
  shortDescription: ['Manage all operations for user groups.'],
  loadChildren: () =>
    import(
      '../../../../../app/pages/tools/pages/user-group-management/user-group-management.module'
    ).then(m => m.UserGroupManagementModule),
  hideFromUnauthorized: true,
};
