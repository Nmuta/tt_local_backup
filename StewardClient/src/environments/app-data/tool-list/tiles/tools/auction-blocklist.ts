import { GameTitle } from '@models/enums';
import { HomeTileInfoInternal, AppIcon, NavbarTool, CommonAccessLevels } from '../../helpers';

export const auctionBlocklistTile = <HomeTileInfoInternal>{
  icon: AppIcon.ItemBan,
  tool: NavbarTool.AuctionBlocklist,
  accessList: CommonAccessLevels.OldNavbarAppOnly,
  title: 'Auction Blocklist',
  subtitle: 'Ban cars from auction',
  supportedTitles: [GameTitle.FH4, GameTitle.FH5],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'Manage the list of cars blocked on the Auction House',
  shortDescription: [`Manage the list of cars blocked on the Auction House`],
  loadChildren: () =>
    import('../../../../../app/pages/tools/pages/auction-blocklist/auction-blocklist.module').then(
      m => m.StewardAuctionBlocklistModule,
    ),
};
