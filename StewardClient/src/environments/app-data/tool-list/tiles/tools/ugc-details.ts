import { GameTitle } from '@models/enums';
import { HomeTileInfoInternal, AppIcon, NavbarTool, CommonAccessLevels } from '../../helpers';

export const ugcDetailsTile = <HomeTileInfoInternal>{
  icon: AppIcon.PlayerInfo,
  tool: NavbarTool.UgcDetails,
  accessList: CommonAccessLevels.PlayerDetails,
  title: 'UGC Details',
  subtitle: 'User Generated Content',
  supportedTitles: [GameTitle.FH4, GameTitle.FH5, GameTitle.FM8],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'View extended information about a single UGC item',
  shortDescription: [`View extended information about a single UGC item`],
  loadChildren: () =>
    import('../../../../../app/pages/tools/pages/ugc-details/ugc-details.module').then(
      m => m.UgcDetailsModule,
    ),
};
