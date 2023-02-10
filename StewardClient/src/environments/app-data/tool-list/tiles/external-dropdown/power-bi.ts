import { GameTitle, UserRole } from '@models/enums';
import {
  AppIcon,
  NavbarTool,
  ExtraIcon,
  HomeTileInfoMultiExternal,
  LOAD_EXTERNAL_DROPDOWN_MENU,
} from '../../helpers';

export const powerBIExternalDropdownTile = <HomeTileInfoMultiExternal>{
  icon: AppIcon.PowerBiTools,
  extraIcon: ExtraIcon.External,
  tool: NavbarTool.PowerBiTools,
  accessList: [UserRole.LiveOpsAdmin, UserRole.SupportAgentAdmin, UserRole.GeneralUser],
  title: 'Power BI',
  subtitle: 'Various Dashboards',
  supportedTitles: [GameTitle.FH5],
  allPermissions: [],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'Various Power BI Dashboards',
  shortDescription: [`Various Power BI Dashboards, such as for Actions and Notifications`],
  externalUrls: [
    {
      text: 'Steward Actions',
      icon: 'work_history',
      tooltip:
        'Group of Power BI dashboards showing actions done in Steward by type of action, application role, and user',
      url: 'https://msit.powerbi.com/groups/me/apps/fd78489b-3fe6-4947-9df3-5c810f249b07/reports/b0e0b3d1-44b6-4f36-bc7b-cda5a3ea938a/ReportSection297d5da0c075521c0999',
    },
    {
      text: 'FH5 Notifications Read',
      icon: 'campaign',
      tooltip: 'Power BI Dashboard showing data on notifications read by users',
      url: 'https://msit.powerbi.com/groups/me/apps/7478402a-b842-459b-8fb6-1b38a2d9a1eb/reports/b94cbd3f-c349-4f1c-91b8-118c7082fb42/ReportSection297d5da0c075521c0999',
    },
    {
      text: 'FH5 Ban History',
      icon: 'work_history',
      tooltip: 'Power BI Dashboard showing all ban history within FH5',
      url: 'https://msit.powerbi.com/groups/me/apps/7478402a-b842-459b-8fb6-1b38a2d9a1eb/reports/8384c110-fb3f-49e7-8996-0e0d7be7abd3/ReportSection297d5da0c075521c0999',
    },
  ],
  hideFromUnauthorized: true,
  navComponent: LOAD_EXTERNAL_DROPDOWN_MENU,
  tileActionComponent: LOAD_EXTERNAL_DROPDOWN_MENU,
};
