import { Type } from '@angular/core';
import { LoadChildren } from '@angular/router';
import { UserRole } from '@models/enums';
import { chain, values } from 'lodash';

/**
 * App names to load.
 * String portion must be route-friendly.
 * Changing these values will change the routes of the tools.
 */
export enum NavbarTool {
  DataObligation = 'obligation',
  SearchUGC = 'search-ugc',
  UgcDetails = 'ugc-details',
  Gifting = 'gifting',
  UserDetails = 'user-details',
  UserBanning = 'user-banning',
  GiftHistory = 'gift-history',
  Kusto = 'kusto',
  AuctionBlocklist = 'auction-blocklist',
  StewardUserHistory = 'steward-user-history',
  Salus = 'salus',
  Zendesk = 'zendesk',
  Sprinklr = 'sprinklr',
  Pegasus = 'pegasus',

  AdminPagesSelector = 'admin-selector',

  BanReview = 'ban-review',
  Messaging = 'messaging',
  AuctionDetails = 'auction-details',
  StewardManagement = 'steward-management',
  Leaderboards = 'leaderboards',
  Theming = 'theming',
  RacersCup = 'racers-cup',
  UserGroupManagement = 'user-group-management',
  PowerBiTools = 'power-bi-tools',
}

/** The common access levels for the app. Used to generate role guards. */
export const CommonAccessLevels = {
  Everyone: values(UserRole),
  OldNavbarAppOnly: [
    UserRole.LiveOpsAdmin,
    UserRole.SupportAgentAdmin,
    UserRole.SupportAgent,
    UserRole.SupportAgentNew,
  ],
  OldNavbarAppAdminOnly: [UserRole.LiveOpsAdmin, UserRole.SupportAgentAdmin],
  OldCommunityAppOnly: [UserRole.LiveOpsAdmin, UserRole.CommunityManager],
  OldCommunityAndNavbarAppOnly: [
    UserRole.LiveOpsAdmin,
    UserRole.SupportAgentAdmin,
    UserRole.SupportAgent,
    UserRole.SupportAgentNew,
    UserRole.CommunityManager,
  ],
  DataPipelineAppOnly: [
    UserRole.LiveOpsAdmin,
    UserRole.DataPipelineAdmin,
    UserRole.DataPipelineContributor,
    UserRole.DataPipelineRead,
  ],
  CommunityManagersAndAdmins: [
    UserRole.LiveOpsAdmin,
    UserRole.SupportAgentAdmin,
    UserRole.CommunityManager,
  ],
  PlayerDetails: [
    UserRole.LiveOpsAdmin,
    UserRole.SupportAgentAdmin,
    UserRole.SupportAgent,
    UserRole.SupportAgentNew,
    UserRole.CommunityManager,
    UserRole.MediaTeam,
    UserRole.HorizonDesigner,
    UserRole.MotorsportDesigner,
  ],
  Leaderboards: [
    UserRole.LiveOpsAdmin,
    UserRole.HorizonDesigner,
    UserRole.SupportAgentAdmin,
    UserRole.CommunityManager,
  ],
  RacersCup: [UserRole.LiveOpsAdmin, UserRole.MotorsportDesigner],
  UserGroupManagement: [
    UserRole.LiveOpsAdmin,
    UserRole.SupportAgentAdmin,
    UserRole.SupportAgent,
    UserRole.SupportAgentNew,
    UserRole.CommunityManager,
    UserRole.MediaTeam,
    UserRole.HorizonDesigner,
    UserRole.MotorsportDesigner,
  ],
  AdminPageAccess: [UserRole.LiveOpsAdmin, UserRole.SupportAgentAdmin, UserRole.CommunityManager],
  SearchUgc: [
    UserRole.LiveOpsAdmin,
    UserRole.SupportAgentAdmin,
    UserRole.CommunityManager,
    UserRole.MediaTeam,
  ],
  Gifting: [
    UserRole.LiveOpsAdmin,
    UserRole.SupportAgentAdmin,
    UserRole.SupportAgent,
    UserRole.SupportAgentNew,
    UserRole.CommunityManager,
    UserRole.MediaTeam,
  ],
};

/**
 * Enum from apps to standard angular icons.
 * Select from here https://fonts.google.com/icons?selected=Material+Icons
 */
export enum AppIcon {
  DeveloperTool = 'integration_instructions',
  ZendeskTool = 'support_agent',
  PlayerInfo = 'person_search',
  PlayerCog = 'manage_accounts',
  PlayerGift = 'card_giftcard',
  PlayerBan = 'gavel',
  ItemBan = 'gavel',
  Kusto = 'cloud',
  Info = 'info',
  Danger = 'gpp_maybe',
  AdminInfo = 'policy',
  Admin = 'shield',
  BanHistory = 'manage_search',
  Messaging = 'mail',
  AuctionDetails = 'price_check',
  StewardManagement = 'cloud_sync',
  Leaderboards = 'leaderboard',
  RacersCup = 'calendar_today',
  UserGroupManagement = 'group',
  PowerBiTools = 'dashboard',
  RetailEnvironment = 'face',
  DevEnvironment = 'admin_panel_settings',
}

/** Enum from apps to standard angualr icons; which are displayed alongside links to the tool. */
export enum ExtraIcon {
  External = 'open_in_new',
  Custom = 'toggle_on',
}

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

/** Base model for Home Tiles. */
export interface HomeTileInfoBase {
  /** The primary icon that is displayed alongside this tool's title. As in the top-level of the tiles. */
  readonly icon: string;

  /** The icon that is displayed alongside this tool's link. As in links that open to an external tool. */
  readonly extraIcon?: string;

  /** The slug identifier of the tool. */
  readonly tool: NavbarTool;

  /** Previous tool routes. Used to generate redirects to the canonical {@link HomeTileInfoBase.tool} route. */
  readonly oldToolRoutes?: string[];

  /** The displayed title of the tool. As in the navbar and card titles. Should be very short. */
  readonly title: string;

  /** The displayed subtitle of the tool. As below the card title. Should be quite short. */
  readonly subtitle: string;

  /** A URL to an image that represents this tool. As displayed at the top of the card body. */
  readonly imageUrl?: string;

  /** Alt text describing the image that represents this tool. */
  readonly imageAlt?: string;

  /** A short description for tooltips linking to this tool. */
  readonly tooltipDescription: string;

  /** A short description for the home page. Each element is a paragraph. */
  readonly shortDescription: string[];

  /**
   * The list of roles allowed access to this tool.
   *
   * Must be from {@link CommonAccessLevels} or a single-element-array.
   */
  readonly accessList: UserRole[];

  /** Hides the tool on home page from unauthroized users. */
  readonly hideFromUnauthorized?: boolean;
}

/** Type for a custom tile. */
export type CustomTileComponent = { disabled: boolean; item: HomeTileInfo };

/** Model for Home Tiles that send the user to internal tools. */
export interface HomeTileInfoCustomTile extends HomeTileInfoBase {
  /** Component to render below the tile summary. */
  readonly tileContentComponent?: () => Promise<Type<CustomTileComponent>>;
  /** Component to render in the nav instead of the usual link. */
  readonly navComponent?: () => Promise<Type<CustomTileComponent>>;
  /** Component to render as the tile action instead of the usual button. */
  readonly tileActionComponent?: () => Promise<Type<CustomTileComponent>>;

  /** When true, disables the "open" link. */
  readonly hideLink?: true;
}

/** Model for Home Tiles that send the user to internal tools. */
export interface HomeTileInfoInternal extends HomeTileInfoBase {
  /** Angular hook which chooses the target module for lazy-loading. */
  readonly loadChildren: LoadChildren;
}

/** Model for Home Tiles that send the user to external tools. */
export interface HomeTileInfoExternal extends HomeTileInfoBase {
  /** Target URL for opening a link in a new tab. */
  externalUrl: string;
}

/** A single e ntry in an external URL dropdown entry. */
export interface ExternalUrlDropdownEntry {
  text: string;
  tooltip?: string;
  icon?: string;
  url: string;
}

/** Model for Home Tiles that send the user to external tools. */
export interface HomeTileInfoMultiExternal extends HomeTileInfoBase {
  /** Target URLs for opening a link in a new tab. */
  externalUrls: ExternalUrlDropdownEntry[];
}

/** Union type for home tiles. */
export type HomeTileInfoCore =
  | HomeTileInfoInternal
  | HomeTileInfoExternal
  | HomeTileInfoCustomTile
  | HomeTileInfoMultiExternal;

/** Intersection type for all possible home-tile tweaks. */
export type HomeTileModifiersIntersection = HomeTileInfoCustomTile;

/** Union type for all possible home-tile tweaks. */
export type HomeTileModifiersUnion = HomeTileInfoCustomTile;

/** Union type for home tiles. */
// eslint-disable-next-line @typescript-eslint/ban-types
export type HomeTileInfo = HomeTileInfoCore & ({} | HomeTileModifiersIntersection);

/** True if the given tile is an external tool. */
export function isHomeTileInfoExternal(
  homeTileInfo: HomeTileInfo,
): homeTileInfo is HomeTileInfoExternal {
  return !!(homeTileInfo as HomeTileInfoExternal).externalUrl;
}
/** True if the given tile handles multiple external tools. */
export function isHomeTileInfoMultiExternal(
  homeTileInfo: HomeTileInfo,
): homeTileInfo is HomeTileInfoMultiExternal {
  return !!(homeTileInfo as HomeTileInfoMultiExternal).externalUrls;
}

/** True if the given tile is an internal tool. */
export function isHomeTileInfoInternal(
  homeTileInfo: HomeTileInfo,
): homeTileInfo is HomeTileInfoInternal {
  return !!(homeTileInfo as HomeTileInfoInternal).loadChildren;
}

/** Use to produce a named dropdown menu for the given component. */
const LOAD_EXTERNAL_DROPDOWN_MENU = () =>
  import('../../app/shared/modules/nav/external-dropdown/external-dropdown.component').then(
    m => m.ExternalDropdownComponent,
  );

/** The unprocessed tool list. Use @see environment.tools instead. */
export const unprocessedToolList: HomeTileInfo[] = [
  <HomeTileInfoInternal>{
    icon: AppIcon.PlayerInfo,
    tool: NavbarTool.UserDetails,
    accessList: CommonAccessLevels.PlayerDetails,
    title: 'Player Details',
    subtitle: 'Detailed player info',
    imageUrl: undefined,
    imageAlt: undefined,
    tooltipDescription: 'First stop for detailed player info',
    shortDescription: [`First stop for detailed player info`],
    loadChildren: () =>
      import('../../app/pages/tools/pages/user-details/user-details.module').then(
        m => m.UserDetailsModule,
      ),
  },
  <HomeTileInfoInternal>{
    icon: AppIcon.PlayerBan,
    tool: NavbarTool.UserBanning,
    accessList: CommonAccessLevels.OldNavbarAppOnly,
    title: 'Banning',
    subtitle: 'Ban players',
    imageUrl: undefined,
    imageAlt: undefined,
    tooltipDescription: 'Ban users by XUID or Gamertag',
    shortDescription: [`Ban users by XUID or Gamertag`],
    loadChildren: () =>
      import('../../app/pages/tools/pages/user-banning/user-banning.module').then(
        m => m.UserBanningModule,
      ),
  },
  <HomeTileInfoInternal>{
    icon: AppIcon.BanHistory,
    tool: NavbarTool.BanReview,
    oldToolRoutes: ['ban-history', 'bulk-ban-history'],
    accessList: CommonAccessLevels.OldCommunityAndNavbarAppOnly,
    title: 'Ban Review',
    subtitle: 'View past bans',
    imageUrl: undefined,
    imageAlt: undefined,
    tooltipDescription:
      'Review, approve, and remove players from a list based on their ban summaries in different environments',
    shortDescription: [
      `Review, approve, and remove players from a list based on their ban summaries in different environments`,
    ],
    loadChildren: () =>
      import('../../app/pages/tools/pages/bulk-ban-review/bulk-ban-review.module').then(
        m => m.BulkBanReviewModule,
      ),
  },
  <HomeTileInfoInternal>{
    icon: AppIcon.PlayerGift,
    tool: NavbarTool.Gifting,
    accessList: CommonAccessLevels.Gifting,
    title: 'Gifting',
    subtitle: 'Send gifts',
    imageUrl: undefined,
    imageAlt: undefined,
    tooltipDescription: 'Send gifts, currency, etc. to individual players or groups of players',
    shortDescription: [`Send gifts, currency, etc. to individual players or groups of players`],
    loadChildren: () =>
      import('../../app/pages/tools/pages/gifting/gifting.module').then(m => m.GiftingsModule),
  },
  <HomeTileInfoInternal>{
    icon: AppIcon.PlayerCog,
    tool: NavbarTool.GiftHistory,
    accessList: CommonAccessLevels.OldCommunityAndNavbarAppOnly,
    title: 'Gift History',
    subtitle: 'View past gifts',
    imageUrl: undefined,
    imageAlt: undefined,
    tooltipDescription: 'View gifting history by player or LSP group',
    shortDescription: [`View gifting history by player or LSP group`],
    loadChildren: () =>
      import('../../app/pages/tools/pages/gift-history/gift-history.module').then(
        m => m.GiftHistoryModule,
      ),
  },
  <HomeTileInfoInternal>{
    icon: AppIcon.PlayerInfo,
    tool: NavbarTool.SearchUGC,
    oldToolRoutes: ['ugc'],
    accessList: CommonAccessLevels.Gifting,
    title: 'UGC Search',
    subtitle: 'Search User Generated Content',
    imageUrl: undefined,
    imageAlt: undefined,
    tooltipDescription: 'Search public UGC by model, ugc type, and keywords.',
    shortDescription: [`Search public UGC by model, ugc type, and keywords.`],
    loadChildren: () => import('../../app/pages/tools/pages/ugc/ugc.module').then(m => m.UgcModule),
  },
  <HomeTileInfoInternal>{
    icon: AppIcon.PlayerInfo,
    tool: NavbarTool.UgcDetails,
    accessList: CommonAccessLevels.PlayerDetails,
    title: 'UGC Details',
    subtitle: 'User Generated Content',
    imageUrl: undefined,
    imageAlt: undefined,
    tooltipDescription: 'View extended information about a single UGC item',
    shortDescription: [`View extended information about a single UGC item`],
    loadChildren: () =>
      import('../../app/pages/tools/pages/ugc-details/ugc-details.module').then(
        m => m.UgcDetailsModule,
      ),
  },
  <HomeTileInfoInternal>{
    icon: AppIcon.AuctionDetails,
    tool: NavbarTool.AuctionDetails,
    accessList: CommonAccessLevels.OldCommunityAndNavbarAppOnly,
    title: 'Auction Details',
    subtitle: 'Live auction data',
    imageUrl: undefined,
    imageAlt: undefined,
    tooltipDescription: 'View the current state of an auction',
    shortDescription: [
      'View the canonical state of an auction, as Services knows it.',
      'Lookup is by Auction ID.',
    ],
    loadChildren: () =>
      import('../../app/pages/tools/pages/auction/auction.module').then(m => m.AuctionModule),
  },
  <HomeTileInfoInternal>{
    icon: AppIcon.ItemBan,
    tool: NavbarTool.AuctionBlocklist,
    accessList: CommonAccessLevels.OldNavbarAppOnly,
    title: 'Auction Blocklist',
    subtitle: 'Ban cars from auction',
    imageUrl: undefined,
    imageAlt: undefined,
    tooltipDescription: 'Manage the list of cars blocked on the Auction House',
    shortDescription: [`Manage the list of cars blocked on the Auction House`],
    loadChildren: () =>
      import('../../app/pages/tools/pages/auction-blocklist/auction-blocklist.module').then(
        m => m.StewardAuctionBlocklistModule,
      ),
  },
  <HomeTileInfoInternal>{
    icon: AppIcon.Messaging,
    tool: NavbarTool.Messaging,
    oldToolRoutes: ['notifications'],
    accessList: CommonAccessLevels.CommunityManagersAndAdmins,
    title: 'Messaging',
    subtitle: 'Manage player messages',
    imageUrl: undefined,
    imageAlt: undefined,
    tooltipDescription: 'Send, edit, and delete in-game messages.',
    shortDescription: [`Send, edit, and delete in-game messages.`],
    loadChildren: () =>
      import('../../app/pages/tools/pages/notifications/notifications.module').then(
        m => m.NotificationsModule,
      ),
  },
  <HomeTileInfoInternal>{
    icon: AppIcon.Kusto,
    tool: NavbarTool.Kusto,
    accessList: CommonAccessLevels.OldNavbarAppOnly,
    title: 'Kusto',
    subtitle: 'Make kusto queries',
    imageUrl: undefined,
    imageAlt: undefined,
    tooltipDescription: 'Perform stored and custom Kusto queries',
    shortDescription: [`Perform stored and custom Kusto queries`],
    loadChildren: () =>
      import('../../app/pages/tools/pages/kusto/kusto.module').then(m => m.KustoModule),
  },
  <HomeTileInfoInternal>{
    icon: AppIcon.AdminInfo,
    tool: NavbarTool.StewardUserHistory,
    accessList: CommonAccessLevels.OldNavbarAppAdminOnly,
    title: 'Job History',
    subtitle: 'Past actions',
    imageUrl: undefined,
    imageAlt: undefined,
    tooltipDescription: 'View your job history',
    shortDescription: [`View  your background job history`],
    loadChildren: () =>
      import('../../app/pages/tools/pages/steward-user-history/steward-user-history.module').then(
        m => m.StewardUserHistoryModule,
      ),
  },
  <HomeTileInfoInternal>{
    icon: AppIcon.DeveloperTool,
    tool: NavbarTool.DataObligation,
    oldToolRoutes: ['data-pipeline-obligation'],
    accessList: CommonAccessLevels.DataPipelineAppOnly,
    title: 'Obligation',
    subtitle: 'A data pipeline tool',
    imageUrl: undefined,
    imageAlt: undefined,
    tooltipDescription: 'Configure Data Activity processing',
    shortDescription: [`Configure Data Activity processing`],
    loadChildren: () =>
      import('../../app/pages/tools/pages/obligation/obligation.module').then(
        m => m.DataPipelineObligationModule,
      ),
    hideFromUnauthorized: true,
  },
  <HomeTileInfoInternal>{
    icon: AppIcon.Leaderboards,
    tool: NavbarTool.Leaderboards,
    accessList: CommonAccessLevels.Leaderboards,
    title: 'Leaderboards',
    subtitle: 'Manage leaderboards',
    imageUrl: undefined,
    imageAlt: undefined,
    tooltipDescription: 'Review and delete leaderboard score.',
    shortDescription: ['Review and delete leaderboard score.'],
    loadChildren: () =>
      import('../../app/pages/tools/pages/leaderboards/leaderboards.module').then(
        m => m.LeaderboardsModule,
      ),
    hideFromUnauthorized: false,
  },
  <HomeTileInfoInternal>{
    icon: AppIcon.StewardManagement,
    tool: NavbarTool.StewardManagement,
    accessList: [UserRole.LiveOpsAdmin],
    title: 'Meta Tools',
    subtitle: 'Manage Steward',
    imageUrl: undefined,
    imageAlt: undefined,
    tooltipDescription: 'Manage high-level Kusto and Release features within Steward',
    shortDescription: [
      'Tools for managing aspects of steward itself',
      'Manage high-level Kusto and Release features within Steward',
    ],
    loadChildren: () =>
      import('../../app/pages/tools/pages/steward-management/steward-management.module').then(
        m => m.StewardManagementModule,
      ),
    hideFromUnauthorized: true,
  },
  <HomeTileInfoInternal>{
    icon: AppIcon.RacersCup,
    tool: NavbarTool.RacersCup,
    accessList: CommonAccessLevels.RacersCup,
    title: 'Racers Cup',
    subtitle: 'Visualize when racing events occur',
    imageUrl: undefined,
    imageAlt: undefined,
    tooltipDescription: 'Everything you need to know for upcoming Racers Cup events.',
    shortDescription: ['Tool for visualizing upcoming Racers cup events.'],
    loadChildren: () =>
      import('../../app/pages/tools/pages/racers-cup/racers-cup.module').then(
        m => m.RacersCupModule,
      ),
  },
  <HomeTileInfoInternal>{
    icon: AppIcon.UserGroupManagement,
    tool: NavbarTool.UserGroupManagement,
    accessList: CommonAccessLevels.UserGroupManagement,
    title: 'User Group Management',
    subtitle: 'Create & Edit User Groups',
    imageUrl: undefined,
    imageAlt: undefined,
    tooltipDescription: 'Management all operations for user groups.',
    shortDescription: ['Management all operations for user groups.'],
    loadChildren: () =>
      import('../../app/pages/tools/pages/user-group-management/user-group-management.module').then(
        m => m.UserGroupManagementModule,
      ),
    hideFromUnauthorized: true,
  },
  <HomeTileInfoExternal>{
    icon: AppIcon.DeveloperTool,
    extraIcon: ExtraIcon.External,
    tool: NavbarTool.Salus,
    accessList: CommonAccessLevels.OldNavbarAppOnly,
    title: 'Salus',
    subtitle: 'An external UGC moderation tool',
    imageUrl: undefined,
    imageAlt: undefined,
    tooltipDescription: 'External UGC Moderation Tool',
    shortDescription: [`External UGC Moderation Tool`],
    externalUrl: 'https://gmx-dev.azureedge.net/#/dashboard',
  },
  <HomeTileInfoExternal>{
    icon: AppIcon.ZendeskTool,
    extraIcon: ExtraIcon.External,
    tool: NavbarTool.Zendesk,
    accessList: CommonAccessLevels.OldNavbarAppOnly,
    title: 'Zendesk',
    subtitle: 'Tickets',
    imageUrl: undefined,
    imageAlt: undefined,
    tooltipDescription: 'Ticket management and knowledge base',
    shortDescription: [`Ticket management and knowledge base`],
    externalUrl: 'https://support.forzamotorsport.net/admin',
  },
  <HomeTileInfoExternal>{
    icon: AppIcon.ZendeskTool,
    extraIcon: ExtraIcon.External,
    tool: NavbarTool.Sprinklr,
    accessList: CommonAccessLevels.OldCommunityAppOnly,
    title: 'Sprinklr',
    subtitle: 'Social Media Tools',
    imageUrl: undefined,
    imageAlt: undefined,
    tooltipDescription: 'Social Media Tools',
    shortDescription: [`"Unified customer experience management platform"`],
    externalUrl: 'https://app.sprinklr.com/ui/app-redirect',
  },
  <HomeTileInfoExternal>{
    icon: AppIcon.DeveloperTool,
    extraIcon: ExtraIcon.External,
    tool: NavbarTool.Pegasus,
    accessList: [UserRole.LiveOpsAdmin],
    title: 'Pegasus',
    subtitle: 'Forza CMS',
    imageUrl: undefined,
    imageAlt: undefined,
    tooltipDescription: 'Web Services for CMS authoring, snapshotting and publishing',
    shortDescription: [`Web Services for CMS authoring, snapshotting and publishing`],
    externalUrl: 'https://cms.services.forzamotorsport.net/',
  },
  <HomeTileInfoMultiExternal>{
    icon: AppIcon.DeveloperTool,
    extraIcon: ExtraIcon.External,
    tool: NavbarTool.AdminPagesSelector,
    accessList: CommonAccessLevels.AdminPageAccess,
    title: 'Admin Pages',
    subtitle: 'Production / Flight / Dev',
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
  },
  <HomeTileInfoMultiExternal>{
    icon: AppIcon.PowerBiTools,
    extraIcon: ExtraIcon.External,
    tool: NavbarTool.PowerBiTools,
    accessList: [UserRole.LiveOpsAdmin, UserRole.SupportAgentAdmin],
    title: 'Power BI',
    subtitle: 'Various Dashboards',
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
  },
  <HomeTileInfoCustomTile>{
    icon: AppIcon.DeveloperTool,
    extraIcon: ExtraIcon.Custom,
    tool: NavbarTool.Theming,
    accessList: CommonAccessLevels.Everyone,
    title: 'Theming',
    subtitle: 'Darkmode Toggle, etc',
    imageUrl: undefined,
    imageAlt: undefined,
    tooltipDescription: 'Adjust your theme settings',
    shortDescription: [`Adjust your theme settings here or in the cog menu.`],
    tileContentComponent: () =>
      import('../../app/shared/modules/theme/theme-tile-content/theme-tile-content.component').then(
        m => m.ThemeTileContentComponent,
      ),
    navComponent: () =>
      import('../../app/shared/modules/theme/theme-nav-content/theme-nav-content.component').then(
        m => m.ThemeNavContentComponent,
      ),
    hideLink: true,
  },
];

function allToolsForRole(role: UserRole): Partial<Record<NavbarTool, number>> {
  return chain(unprocessedToolList)
    .filter(t => t.accessList.includes(role))
    .map(t => [t.tool, 1])
    .fromPairs()
    .value();
}

/** A lookup table of UserRole -> Default Apps */
export const standardRoleTools: Partial<Record<UserRole, Partial<Record<NavbarTool, number>>>> = {
  [UserRole.CommunityManager]: allToolsForRole(UserRole.CommunityManager),
  [UserRole.DataPipelineAdmin]: allToolsForRole(UserRole.DataPipelineAdmin),
  [UserRole.DataPipelineContributor]: allToolsForRole(UserRole.DataPipelineContributor),
  [UserRole.DataPipelineRead]: allToolsForRole(UserRole.DataPipelineRead),
  [UserRole.LiveOpsAdmin]: allToolsForRole(UserRole.LiveOpsAdmin),
  [UserRole.SupportAgent]: allToolsForRole(UserRole.SupportAgent),
  [UserRole.SupportAgentAdmin]: allToolsForRole(UserRole.SupportAgentAdmin),
  [UserRole.SupportAgentNew]: allToolsForRole(UserRole.SupportAgentNew),
};
