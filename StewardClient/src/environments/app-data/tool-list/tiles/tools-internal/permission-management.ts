import { UserRole } from '@models/enums';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { HomeTileInfoInternal, AppIcon, NavbarTool, HomeTileRestrictionType } from '../../helpers';

export const permissionManagementInternalTile = <HomeTileInfoInternal>{
  icon: AppIcon.PermissionManagement,
  tool: NavbarTool.PermissionManagement,
  accessList: [UserRole.LiveOpsAdmin],
  title: 'Permission Management',
  subtitle: 'Manage Steward permissions',
  supportedTitles: [],
  allPermissions: [],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'Micro-manage permissions within Steward for all users',
  shortDescription: [],
  loadChildren: () =>
    import(
      '../../../../../app/pages/tools/pages/permission-management/permission-management.module'
    ).then(m => m.PermisisionManagementModule),
  hideFromUnauthorized: true,
  restriction: {
    requiredPermissions: [PermAttributeName.AdminFeature],
    action: HomeTileRestrictionType.Disable,
  },
};
