import { GameTitle } from '@models/enums';
import { HomeTileInfoInternal, AppIcon, NavbarTool } from '../../helpers';

export const bountySearchTile = <HomeTileInfoInternal>{
  icon: AppIcon.Bounty,
  tool: NavbarTool.SearchBounty,
  title: 'Bounty Search',
  subtitle: 'Search Bounties',
  supportedTitles: [GameTitle.FM8],
  allPermissions: [],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'Search past and current bounties.',
  shortDescription: [`Search past and current bounties.`],
  loadChildren: () =>
    import('../../../../../app/pages/tools/pages/bounty/bounty.module').then(m => m.BountyModule),
};
