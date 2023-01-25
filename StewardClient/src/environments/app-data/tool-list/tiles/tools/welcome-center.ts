import { UserRole } from '@models/enums';
import { HomeTileInfoInternal, AppIcon, NavbarTool } from '../../helpers';

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
};