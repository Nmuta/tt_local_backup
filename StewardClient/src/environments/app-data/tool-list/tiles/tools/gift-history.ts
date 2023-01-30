import { GameTitle } from '@models/enums';
import { HomeTileInfoInternal, AppIcon, NavbarTool, CommonAccessLevels } from '../../helpers';

export const giftHistoryTile = <HomeTileInfoInternal>{
  icon: AppIcon.PlayerCog,
  tool: NavbarTool.GiftHistory,
  accessList: CommonAccessLevels.OldCommunityAndNavbarAppOnly,
  title: 'Gift History',
  subtitle: 'View past gifts',
  supportedTitles: [GameTitle.FH4, GameTitle.FH5, GameTitle.FM7, GameTitle.FM8],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'View gifting history by player or LSP group',
  shortDescription: [`View gifting history by player or LSP group`],
  loadChildren: () =>
    import('../../../../../app/pages/tools/pages/gift-history/gift-history.module').then(
      m => m.GiftHistoryModule,
    ),
};
