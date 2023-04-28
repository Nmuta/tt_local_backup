import { GameTitle } from '@models/enums';
import {
  AppIcon,
  NavbarTool,
  ExtraIcon,
  HomeTileInfoMultiExternal,
  LOAD_EXTERNAL_DROPDOWN_MENU,
} from '../../helpers';

/** Static links to different admin pages. */
export enum AdminPages {
  SteelheadFlight = 'https://steelheadadmin-flight-15.dev.services.forzamotorsport.net',
  SteelheadStudio = 'https://steelheadadmin-15.dev.services.forzamotorsport.net',
  FH5 = 'https://admin.fh5.forzamotorsport.net/',
  FH5Studio = 'https://woodstockadmin-final.dev.services.forzamotorsport.net/',
  FH4 = 'https://admin.fh4.forzamotorsport.net/',
  FH4Studio = 'https://test-a.fh4.forzamotorsport.net/default.aspx',
  FM7 = 'https://admin.fm7.forzamotorsport.net/',
  FM7Studio = 'https://test-a.fm7.forzamotorsport.net/Pages/Default.aspx',
}

export const adminPagesExternalDropdownTile = <HomeTileInfoMultiExternal>{
  icon: AppIcon.DeveloperTool,
  extraIcon: ExtraIcon.External,
  tool: NavbarTool.AdminPagesSelector,
  title: 'Admin Pages',
  subtitle: 'Production / Flight / Dev',
  supportedTitles: [GameTitle.FH4, GameTitle.FH5, GameTitle.FM7, GameTitle.FM8],
  allPermissions: [],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'Various Admin Pages',
  shortDescription: [`Various Admin Pages`],
  externalUrls: [
    {
      icon: AppIcon.RetailEnvironment,
      text: '(Flight) Steelhead',
      url: AdminPages.SteelheadFlight,
    },
    { icon: AppIcon.RetailEnvironment, text: 'FH5', url: AdminPages.FH5 },
    { icon: AppIcon.RetailEnvironment, text: 'FH4', url: AdminPages.FH4 },
    { icon: AppIcon.RetailEnvironment, text: 'FM7', url: AdminPages.FM7 },
    { icon: AppIcon.DevEnvironment, text: '(Dev) Steelhead', url: AdminPages.SteelheadStudio },
    { icon: AppIcon.DevEnvironment, text: '(Dev) FH5', url: AdminPages.FH5Studio },
    { icon: AppIcon.DevEnvironment, text: '(Dev) FH4', url: AdminPages.FH4Studio },
    { icon: AppIcon.DevEnvironment, text: '(Dev) FM7', url: AdminPages.FM7Studio },
  ],
  navComponent: LOAD_EXTERNAL_DROPDOWN_MENU,
  tileActionComponent: LOAD_EXTERNAL_DROPDOWN_MENU,
};
