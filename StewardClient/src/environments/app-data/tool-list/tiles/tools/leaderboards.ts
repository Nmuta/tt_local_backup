import { GameTitle } from '@models/enums';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { HomeTileInfoInternal, AppIcon, NavbarTool, CommonAccessLevels } from '../../helpers';

export const leaderboardsTile = <HomeTileInfoInternal>{
  icon: AppIcon.Leaderboards,
  tool: NavbarTool.Leaderboards,
  accessList: CommonAccessLevels.Leaderboards,
  title: 'Leaderboards',
  subtitle: 'Manage leaderboards',
  supportedTitles: [GameTitle.FH5],
  allPermissions: [PermAttributeName.DeleteLeaderboardScores],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'Review and delete leaderboard score.',
  shortDescription: ['Review and delete leaderboard score.'],
  loadChildren: () =>
    import('../../../../../app/pages/tools/pages/leaderboards/leaderboards.module').then(
      m => m.LeaderboardsModule,
    ),
  hideFromUnauthorized: false,
};
