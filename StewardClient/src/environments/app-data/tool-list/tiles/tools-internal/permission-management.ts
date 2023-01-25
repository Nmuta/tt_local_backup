import { UserRole } from '@models/enums';
import { HomeTileInfoInternal, AppIcon, NavbarTool } from '../../helpers';

export const permissionManagementInternalTile = <HomeTileInfoInternal>{
  icon: AppIcon.PermissionManagement,
  tool: NavbarTool.PermissionManagement,
  accessList: [UserRole.LiveOpsAdmin],
  title: 'Permission Management',
  subtitle: 'Manage Steward permissions',
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'Micro-manage permissions within Steward for all users',
  shortDescription: [],
  loadChildren: () =>
    import(
      '../../../../../app/pages/tools/pages/permission-management/permission-management.module'
    ).then(m => m.PermisisionManagementModule),
  hideFromUnauthorized: true,
};
