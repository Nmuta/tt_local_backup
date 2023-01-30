import { UserRole } from '@models/enums';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { HomeTileInfoInternal, AppIcon, NavbarTool, HomeTileRestrictionType } from '../../helpers';

export const welcomeCenterTile = <HomeTileInfoInternal>{
  icon: AppIcon.WelcomeCenterTile,
  tool: NavbarTool.WelcomeCenterTiles,
  accessList: [UserRole.LiveOpsAdmin],
  title: 'Welcome Center Tiles',
  subtitle: 'Manage Welcome Center Tiles',
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'View and edit Welcome Center Tiles.',
  shortDescription: [`View and edit Welcome Center Calendar Tile Details.`],
  loadChildren: () =>
    import(
      '../../../../../app/pages/tools/pages/welcome-center-tiles/welcome-center-tiles.module'
    ).then(m => m.WelcomeCenterTilesModule),
  hideFromUnauthorized: true,
  restriction: {
    requiredPermissions: [PermAttributeName.AdminFeature],
    action: HomeTileRestrictionType.Hide,
  },
};
