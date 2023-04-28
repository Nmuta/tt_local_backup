import { GameTitle } from '@models/enums';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { HomeTileInfoInternal, AppIcon, NavbarTool } from '../../helpers';

export const playerInfoTile = <HomeTileInfoInternal>{
  icon: AppIcon.PlayerInfo,
  tool: NavbarTool.UserDetails,
  title: 'Player Details',
  subtitle: 'Detailed player info',
  supportedTitles: [GameTitle.FH3, GameTitle.FH4, GameTitle.FH5, GameTitle.FM7, GameTitle.FM8],
  allPermissions: [
    PermAttributeName.BanConsole,
    PermAttributeName.DeleteBan,
    PermAttributeName.UpdateUserFlags,
    PermAttributeName.AddProfileNote,
    PermAttributeName.SetReportWeight,
  ],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'First stop for detailed player info',
  shortDescription: [`First stop for detailed player info`],
  loadChildren: () =>
    import('../../../../../app/pages/tools/pages/user-details/user-details.module').then(
      m => m.UserDetailsModule,
    ),
};
