import { GameTitle } from '@models/enums';
import { HomeTileInfoInternal, AppIcon, NavbarTool } from '../../helpers';

export const bountyDetailsTile = <HomeTileInfoInternal>{
  icon: AppIcon.Bounty,
  tool: NavbarTool.BountyDetails,
  title: 'Bounty Details',
  subtitle: 'Bounty Details',
  supportedTitles: [GameTitle.FM8],
  allPermissions: [],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'View details about a bounty.',
  shortDescription: [`View details about a bounty.`],
  loadChildren: () =>
    import('../../../../../app/pages/tools/pages/bounty-details/bounty-details.module').then(
      m => m.BountyDetailsModule,
    ),
};
