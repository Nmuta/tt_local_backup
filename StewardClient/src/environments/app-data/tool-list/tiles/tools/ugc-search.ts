import { GameTitle } from '@models/enums';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { HomeTileInfoInternal, AppIcon, NavbarTool } from '../../helpers';

export const ugcSearchTile = <HomeTileInfoInternal>{
  icon: AppIcon.PlayerInfo,
  tool: NavbarTool.SearchUGC,
  oldToolRoutes: ['ugc'],
  title: 'UGC Search',
  subtitle: 'Search User Generated Content',
  supportedTitles: [GameTitle.FH5, GameTitle.FM8],
  allPermissions: [PermAttributeName.HideUgc],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'Search public UGC by model, ugc type, and keywords.',
  shortDescription: [`Search public UGC by model, ugc type, and keywords.`],
  loadChildren: () =>
    import('../../../../../app/pages/tools/pages/ugc/ugc.module').then(m => m.UgcModule),
};
