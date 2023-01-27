import { GameTitle } from '@models/enums';
import { HomeTileInfoInternal, AppIcon, NavbarTool, CommonAccessLevels } from '../../helpers';

export const auctionDetailsTile = <HomeTileInfoInternal>{
  icon: AppIcon.AuctionDetails,
  tool: NavbarTool.AuctionDetails,
  accessList: CommonAccessLevels.OldCommunityAndNavbarAppOnly,
  title: 'Auction Details',
  subtitle: 'Live auction data',
  supportedTitles: [GameTitle.FH4, GameTitle.FH5],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'View the current state of an auction',
  shortDescription: [
    'View the canonical state of an auction, as Services knows it.',
    'Lookup is by Auction ID.',
  ],
  loadChildren: () =>
    import('../../../../../app/pages/tools/pages/auction/auction.module').then(
      m => m.AuctionModule,
    ),
};
