import { GameTitle } from '@models/enums';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { HomeTileInfoInternal, AppIcon, NavbarTool, CommonAccessLevels } from '../../helpers';

export const banningTile = <HomeTileInfoInternal>{
  icon: AppIcon.PlayerBan,
  tool: NavbarTool.UserBanning,
  accessList: CommonAccessLevels.OldNavbarAppOnly,
  title: 'Banning',
  subtitle: 'Ban players',
  supportedTitles: [GameTitle.FH4, GameTitle.FH5, GameTitle.FM7, GameTitle.FM8],
  allPermissions: [PermAttributeName.BanPlayer],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'Ban users by XUID or Gamertag',
  shortDescription: [`Ban users by XUID or Gamertag`],
  loadChildren: () =>
    import('../../../../../app/pages/tools/pages/user-banning/user-banning.module').then(
      m => m.UserBanningModule,
    ),
};
