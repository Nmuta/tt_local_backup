import { GameTitle } from '@models/enums';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { HomeTileInfoInternal, AppIcon, NavbarTool, CommonAccessLevels, HomeTileRestrictionType } from '../../helpers';

export const auctionCreateTile = <HomeTileInfoInternal>{
  icon: AppIcon.CreateAuction,
  tool: NavbarTool.CreateAuction,
  accessList: CommonAccessLevels.AdminAndGeneralUsers,
  title: 'Create Auction',
  subtitle: 'Create auction',
  supportedTitles: [GameTitle.FH5],
  allPermissions: [PermAttributeName.CreateAuctions],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'Create single or bulk auction(s)',
  shortDescription: [`Create a single auction or bulk auctions`],
  loadChildren: () =>
    import('../../../../../app/pages/tools/pages/create-auction/create-auction.module').then(
      m => m.CreateAuctionModule,
    ),
  hideFromUnauthorized: true,
  restriction: {
    requiredPermissions: [PermAttributeName.CreateAuctions],
    action: HomeTileRestrictionType.Disable,
  },
};
