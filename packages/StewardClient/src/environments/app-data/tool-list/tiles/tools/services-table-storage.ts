import { GameTitle, UserRole } from '@models/enums';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { HomeTileInfoInternal, AppIcon, NavbarTool, HomeTileRestrictionType } from '../../helpers';

export const servicesTableStorageTile = <HomeTileInfoInternal>{
  icon: AppIcon.ServicesTableStorage,
  tool: NavbarTool.ServicesTableStorage,
  accessList: [UserRole.LiveOpsAdmin],
  title: "Service's Table Storage",
  subtitle: "View Service's table storage",
  supportedTitles: [GameTitle.FM8],
  allPermissions: [],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: "View Service's table storage rows for a given user.",
  shortDescription: [`View Service\'s table storage rows for a given user.`],
  loadChildren: () =>
    import(
      '../../../../../app/pages/tools/pages/services-table-storage/services-table-storage.module'
    ).then(m => m.ServicesTableStorageModule),
  hideFromUnauthorized: false,
  restriction: {
    requiredPermissions: [PermAttributeName.AdminFeature],
    action: HomeTileRestrictionType.Disable,
  },
};
