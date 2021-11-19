import { LoadChildren } from '@angular/router';
import { UserRole } from '@models/enums';
import { chain } from 'lodash';

/**
 * App names to load.
 * String portion must be route-friendly.
 * Changing these values will change the routes of the tools.
 */
export enum NavbarTool {
  DataObligation = 'obligation',
  UGC = 'ugc',
  Gifting = 'gifting',
  UserDetails = 'user-details',
  UserBanning = 'user-banning',
  GiftHistory = 'gift-history',
  Kusto = 'kusto',
  AuctionBlocklist = 'auction-blocklist',
  StewardUserHistory = 'steward-user-history',
  Salus = 'salus',
  BulkBanHistory = 'bulk-ban-history',
  Notifications = 'notifications',
  AuctionDetails = 'auction-details',
  StewardManagement = 'steward-management',
}

/** The common access levels for the app. Used to generate role guards. */
export const CommonAccessLevels = {
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
};

/**
 * Enum from apps to standard angular icons.
 * Select from here https://fonts.google.com/icons?selected=Material+Icons
 */
export enum AppIcon {
  DeveloperTool = 'integration_instructions',
  PlayerInfo = 'person_search',
  PlayerGift = 'card_giftcard',
  PlayerBan = 'gavel',
  ItemBan = 'gavel',
  Kusto = 'cloud',
  Info = 'info',
  Danger = 'gpp_maybe',
  AdminInfo = 'policy',
  Admin = 'shield',
  BulkBanHistory = 'manage_search',
  Messaging = 'mail',
  AuctionDetails = 'price_check',
  StewardManagement = 'cloud_sync',
}

/** Enum from apps to standard angualr icons; which are displayed alongside links to the tool. */
export enum ExtraIcon {
  External = 'open_in_new',
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

/** Union type for home tiles. */
export type HomeTileInfo = HomeTileInfoInternal | HomeTileInfoExternal;

/** True if the given tile is an external tool. */
export function isHomeTileInfoExternal(
  homeTileInfo: HomeTileInfo,
): homeTileInfo is HomeTileInfoExternal {
  return !!(homeTileInfo as HomeTileInfoExternal).externalUrl;
}

/** True if the given tile is an internal tool. */
export function isHomeTileInfoInternal(
  homeTileInfo: HomeTileInfo,
): homeTileInfo is HomeTileInfoInternal {
  return !!(homeTileInfo as HomeTileInfoInternal).loadChildren;
}

/** The unprocessed tool list. Use @see environment.tools instead. */
export const unprocessedToolList: HomeTileInfo[] = [
  <HomeTileInfoInternal>{
    icon: AppIcon.PlayerInfo,
    tool: NavbarTool.UGC,
    accessList: CommonAccessLevels.OldCommunityAppOnly,
    title: 'UGC',
    subtitle: 'A community agent tool',
    imageUrl: undefined,
    imageAlt: undefined,
    tooltipDescription: 'View information about a player',
    shortDescription: [`View information about a player`],
    loadChildren: () => import('../../app/shared/pages/ugc/ugc.module').then(m => m.UGCModule),
  },
  <HomeTileInfoInternal>{
    icon: AppIcon.PlayerInfo,
    tool: NavbarTool.UserDetails,
    accessList: CommonAccessLevels.OldCommunityAndNavbarAppOnly,
    title: 'Player Details',
    subtitle: 'A support agent tool',
    imageUrl: undefined,
    imageAlt: undefined,
    tooltipDescription: 'View information about a player',
    shortDescription: [`View information about a player`],
    loadChildren: () =>
      import('../../app/shared/pages/user-details/user-details.module').then(
        m => m.UserDetailsModule,
      ),
  },
  <HomeTileInfoInternal>{
    icon: AppIcon.PlayerGift,
    tool: NavbarTool.Gifting,
    accessList: CommonAccessLevels.OldCommunityAndNavbarAppOnly,
    title: 'Gifting',
    subtitle: 'A support agent tool',
    imageUrl: undefined,
    imageAlt: undefined,
    tooltipDescription: 'Send gifts, currency, etc. to individual players or groups of players',
    shortDescription: [`Send gifts, currency, etc. to individual players or groups of players`],
    loadChildren: () =>
      import('../../app/shared/pages/gifting/gifting.module').then(m => m.GiftingsModule),
  },
  <HomeTileInfoInternal>{
    icon: AppIcon.PlayerBan,
    tool: NavbarTool.UserBanning,
    accessList: CommonAccessLevels.OldNavbarAppOnly,
    title: 'Banning',
    subtitle: 'A support agent tool',
    imageUrl: undefined,
    imageAlt: undefined,
    tooltipDescription: 'Ban users by XUID or Gamertag',
    shortDescription: [`Ban users by XUID or Gamertag`],
    loadChildren: () =>
      import('../../app/shared/pages/user-banning/user-banning.module').then(
        m => m.UserBanningModule,
      ),
  },
  <HomeTileInfoInternal>{
    icon: AppIcon.PlayerInfo,
    tool: NavbarTool.GiftHistory,
    accessList: CommonAccessLevels.OldCommunityAndNavbarAppOnly,
    title: 'Gift History',
    subtitle: 'A support agent tool',
    imageUrl: undefined,
    imageAlt: undefined,
    tooltipDescription: 'View the gifting history of individual users',
    shortDescription: [`View the gifting history of individual users`],
    loadChildren: () =>
      import('../../app/shared/pages/gift-history/gift-history.module').then(
        m => m.GiftHistoryModule,
      ),
  },
  <HomeTileInfoInternal>{
    icon: AppIcon.Kusto,
    tool: NavbarTool.Kusto,
    accessList: CommonAccessLevels.OldNavbarAppOnly,
    title: 'Kusto',
    subtitle: 'A support agent tool',
    imageUrl: undefined,
    imageAlt: undefined,
    tooltipDescription: 'Perform stored and custom Kusto queries',
    shortDescription: [`Perform stored and custom Kusto queries`],
    loadChildren: () =>
      import('../../app/shared/pages/kusto/kusto.module').then(m => m.KustoModule),
  },
  <HomeTileInfoInternal>{
    icon: AppIcon.ItemBan,
    tool: NavbarTool.AuctionBlocklist,
    accessList: CommonAccessLevels.OldNavbarAppOnly,
    title: 'Auction Blocklist',
    subtitle: 'A support agent tool',
    imageUrl: undefined,
    imageAlt: undefined,
    tooltipDescription: 'Manage the list of cars blocked on the Auction House',
    shortDescription: [`Manage the list of cars blocked on the Auction House`],
    loadChildren: () =>
      import('../../app/shared/pages/auction-blocklist/auction-blocklist.module').then(
        m => m.StewardAuctionBlocklistModule,
      ),
  },
  <HomeTileInfoInternal>{
    icon: AppIcon.Messaging,
    tool: NavbarTool.Notifications,
    accessList: CommonAccessLevels.CommunityManagersAndAdmins,
    title: 'Notifications',
    subtitle: 'A tool for sending, editing, and deleting notifications',
    imageUrl: undefined,
    imageAlt: undefined,
    tooltipDescription: 'Send, edit, and delete in-game messages.',
    shortDescription: [`Send, edit, and delete in-game messages.`],
    loadChildren: () =>
      import('../../app/shared/pages/notifications/notifications.module').then(
        m => m.NotificationsModule,
      ),
  },
  <HomeTileInfoInternal>{
    icon: AppIcon.AdminInfo,
    tool: NavbarTool.StewardUserHistory,
    accessList: CommonAccessLevels.OldNavbarAppAdminOnly,
    title: 'Job History',
    subtitle: 'A support agent tool',
    imageUrl: undefined,
    imageAlt: undefined,
    tooltipDescription: 'View your job history',
    shortDescription: [`View  your background job history`],
    loadChildren: () =>
      import('../../app/shared/pages/steward-user-history/steward-user-history.module').then(
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
      import('../../app/shared/pages/obligation/obligation.module').then(
        m => m.DataPipelineObligationModule,
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
  <HomeTileInfoInternal>{
    icon: AppIcon.BulkBanHistory,
    tool: NavbarTool.BulkBanHistory,
    accessList: CommonAccessLevels.OldCommunityAndNavbarAppOnly,
    title: 'Bulk Ban History',
    subtitle: 'A tool to lookup player ban summaries in multiple environments',
    imageUrl: undefined,
    imageAlt: undefined,
    tooltipDescription:
      'Review, approve, and remove players from a list based on their ban summaries in different environments',
    shortDescription: [
      `Review, approve, and remove players from a list based on their ban summaries in different environments`,
    ],
    loadChildren: () =>
      import('../../app/shared/pages/bulk-ban-history/bulk-ban-history.module').then(
        m => m.BulkBanHistoryModule,
      ),
  },
  <HomeTileInfoInternal>{
    icon: AppIcon.StewardManagement,
    tool: NavbarTool.StewardManagement,
    accessList: [UserRole.LiveOpsAdmin],
    title: 'Steward Management',
    subtitle: 'A tool to manage Steward',
    imageUrl: undefined,
    imageAlt: undefined,
    tooltipDescription: 'Manage high-level Kusto and Release features within Steward',
    shortDescription: ['Manage high-level Kusto and Release features within Steward'],
    loadChildren: () =>
      import('../../app/shared/pages/steward-management/steward-management.module').then(
        m => m.StewardManagementModule,
      ),
    hideFromUnauthorized: true,
  },
  <HomeTileInfoInternal>{
    icon: AppIcon.AuctionDetails,
    tool: NavbarTool.AuctionDetails,
    accessList: CommonAccessLevels.OldCommunityAndNavbarAppOnly,
    title: 'Auction Details',
    subtitle: 'View the current state of an auction',
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
