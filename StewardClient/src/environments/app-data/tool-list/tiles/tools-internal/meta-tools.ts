import { UserRole } from '@models/enums';
import { HomeTileInfoInternal, AppIcon, NavbarTool } from '../../helpers';

export const metaToolsInternalTile = <HomeTileInfoInternal>{
  icon: AppIcon.StewardManagement,
  tool: NavbarTool.StewardManagement,
  accessList: [UserRole.LiveOpsAdmin],
  title: 'Meta Tools',
  subtitle: 'Manage Steward',
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'Manage high-level Kusto and Release features within Steward',
  shortDescription: [
    'Tools for managing aspects of steward itself',
    'Manage high-level Kusto and Release features within Steward',
  ],
  loadChildren: () =>
    import(
      '../../../../../app/pages/tools/pages/steward-management/steward-management.module'
    ).then(m => m.StewardManagementModule),
  hideFromUnauthorized: true,
};
