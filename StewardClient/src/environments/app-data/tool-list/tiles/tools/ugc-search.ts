import { GameTitle } from '@models/enums';
import { HomeTileInfoInternal, AppIcon, NavbarTool, CommonAccessLevels } from '../../helpers';

export const ugcSearchTile = <HomeTileInfoInternal>{
  icon: AppIcon.PlayerInfo,
  tool: NavbarTool.SearchUGC,
  oldToolRoutes: ['ugc'],
  accessList: CommonAccessLevels.Gifting,
  title: 'UGC Search',
  subtitle: 'Search User Generated Content',
  supportedTitles: [GameTitle.FH5, GameTitle.FM8],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'Search public UGC by model, ugc type, and keywords.',
  shortDescription: [`Search public UGC by model, ugc type, and keywords.`],
  loadChildren: () =>
    import('../../../../../app/pages/tools/pages/ugc/ugc.module').then(m => m.UgcModule),
};
