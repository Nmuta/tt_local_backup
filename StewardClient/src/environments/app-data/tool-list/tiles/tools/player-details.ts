import { GameTitle } from '@models/enums';
import { HomeTileInfoInternal, AppIcon, NavbarTool, CommonAccessLevels } from '../../helpers';

export const playerInfoTile = <HomeTileInfoInternal>{
  icon: AppIcon.PlayerInfo,
  tool: NavbarTool.UserDetails,
  accessList: CommonAccessLevels.PlayerDetails,
  title: 'Player Details',
  subtitle: 'Detailed player info',
  supportedTitles: [GameTitle.FH3, GameTitle.FH4, GameTitle.FH5, GameTitle.FM7, GameTitle.FM8],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'First stop for detailed player info',
  shortDescription: [`First stop for detailed player info`],
  loadChildren: () =>
    import('../../../../../app/pages/tools/pages/user-details/user-details.module').then(
      m => m.UserDetailsModule,
    ),
};
