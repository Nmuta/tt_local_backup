import { GameTitle } from '@models/enums';
import { HomeTileInfoInternal, AppIcon, NavbarTool } from '../../helpers';

export const banHistoryTile = <HomeTileInfoInternal>{
  icon: AppIcon.BanHistory,
  tool: NavbarTool.BanReview,
  oldToolRoutes: ['ban-history', 'bulk-ban-history'],
  title: 'Ban Review',
  subtitle: 'View past bans',
  supportedTitles: [GameTitle.FH4, GameTitle.FH5, GameTitle.FM7],
  allPermissions: [],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription:
    'Review, approve, and remove players from a list based on their ban summaries in different environments',
  shortDescription: [
    `Review, approve, and remove players from a list based on their ban summaries in different environments`,
  ],
  loadChildren: () =>
    import('../../../../../app/pages/tools/pages/bulk-ban-review/bulk-ban-review.module').then(
      m => m.BulkBanReviewModule,
    ),
};
