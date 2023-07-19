import { GameTitle } from '@models/enums';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { HomeTileInfoInternal, AppIcon, NavbarTool } from '../../helpers';

export const ugcDetailsTile = <HomeTileInfoInternal>{
  icon: AppIcon.PlayerInfo,
  tool: NavbarTool.UgcDetails,
  title: 'UGC Details',
  subtitle: 'User Generated Content',
  supportedTitles: [GameTitle.FH4, GameTitle.FH5, GameTitle.FM8],
  allPermissions: [
    PermAttributeName.FeatureUgc,
    PermAttributeName.HideUgc,
    PermAttributeName.UnhideUgc,
    PermAttributeName.SetUgcGeoFlag,
    PermAttributeName.CloneUgc,
    PermAttributeName.ReportUgc,
    PermAttributeName.PersistUgc,
  ],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'View extended information about a single UGC item',
  shortDescription: [`View extended information about a single UGC item`],
  loadChildren: () =>
    import('../../../../../app/pages/tools/pages/ugc-details/ugc-details.module').then(
      m => m.UgcDetailsModule,
    ),
};
