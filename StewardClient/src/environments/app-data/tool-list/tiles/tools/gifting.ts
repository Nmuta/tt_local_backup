import { GameTitle } from '@models/enums';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { HomeTileInfoInternal, AppIcon, NavbarTool } from '../../helpers';

export const giftingTile = <HomeTileInfoInternal>{
  icon: AppIcon.PlayerGift,
  tool: NavbarTool.Gifting,
  title: 'Gifting',
  subtitle: 'Send gifts',
  supportedTitles: [GameTitle.FH4, GameTitle.FH5, GameTitle.FM7, GameTitle.FM8],
  allPermissions: [PermAttributeName.GiftGroup, PermAttributeName.GiftPlayer],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'Send gifts, currency, etc. to individual players or groups of players',
  shortDescription: [`Send gifts, currency, etc. to individual players or groups of players`],
  loadChildren: () =>
    import('../../../../../app/pages/tools/pages/gifting/gifting.module').then(
      m => m.GiftingsModule,
    ),
};
