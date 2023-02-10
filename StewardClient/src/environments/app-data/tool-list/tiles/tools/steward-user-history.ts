import { HomeTileInfoInternal, AppIcon, NavbarTool, CommonAccessLevels } from '../../helpers';

export const stewardUserHistoryTile = <HomeTileInfoInternal>{
  icon: AppIcon.AdminInfo,
  tool: NavbarTool.StewardUserHistory,
  accessList: CommonAccessLevels.OldNavbarAppAdminOnly,
  title: 'Job History',
  subtitle: 'Past actions',
  supportedTitles: [],
  allPermissions: [],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'View your job history',
  shortDescription: [`View  your background job history`],
  loadChildren: () =>
    import(
      '../../../../../app/pages/tools/pages/steward-user-history/steward-user-history.module'
    ).then(m => m.StewardUserHistoryModule),
};
