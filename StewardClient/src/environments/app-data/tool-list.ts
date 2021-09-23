import { LoadChildren } from '@angular/router';
import { UserRole } from '@models/enums';
import { chain } from 'lodash';

/** App names to load. String portion must be route-friendly. */
export enum NavbarTool {
  DataObligation = 'data-pipeline-obligation',
  UGC = 'ugc',
  Gifting = 'gifting',
  UserDetails = 'user-details',
  UserBanning = 'user-banning',
  GiftHistory = 'gift-history',
  Kusto = 'kusto',
  ServiceManagement = 'service-management',
  StewardUserHistory = 'steward-user-history',
  Messaging = 'messaging',
  Salus = 'salus',
  BulkBanHistory = 'bulk-ban-history',
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
};

/** Enum from apps to standard angular icons. */
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
}

/** Enum from apps to standard angualr icons; which are displayed alongside links to the tool. */
export enum ExtraIcon {
  External = 'open_in_new',
}

/** Base model for Home Tiles. */
export interface HomeTileInfoBase {
  readonly icon: string;
  readonly extraIcon?: string;
  readonly tool: NavbarTool;
  readonly title: string;
  readonly subtitle: string;
  readonly imageUrl?: string;
  readonly imageAlt?: string;

  /** A short description for tooltips linking to this tool. */
  readonly tooltipDescription: string;

  /** A short description for the home page. Each element is a paragraph. */
  readonly shortDescription: string[];

  /** The list of roles allowed access to this tool. */
  readonly accessList: UserRole[];
}

/** Model for Home Tiles that send the user to internal tools. */
export interface HomeTileInfoInternal extends HomeTileInfoBase {
  readonly loadChildren: LoadChildren;
}

/** Model for Home Tiles that send the user to external tools. */
export interface HomeTileInfoExternal extends HomeTileInfoBase {
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
  {
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
  {
    icon: AppIcon.PlayerInfo,
    tool: NavbarTool.UserDetails,
    accessList: CommonAccessLevels.OldNavbarAppOnly,
    title: 'Player Details',
    subtitle: 'A support agent tool',
    imageUrl: undefined,
    imageAlt: undefined,
    tooltipDescription: 'View information about a player',
    shortDescription: [`View information about a player`],
    loadChildren: () =>
      import('../../app/pages/navbar-app/pages/user-details/user-details.module').then(
        m => m.UserDetailsModule,
      ),
  },
  {
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
  {
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
      import('../../app/pages/navbar-app/pages/user-banning/user-banning.module').then(
        m => m.UserBanningModule,
      ),
  },
  {
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
      import('../../app/pages/navbar-app/pages/gift-history/gift-history.module').then(
        m => m.GiftHistoryModule,
      ),
  },
  {
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
      import('../../app/pages/navbar-app/pages/kusto/kusto.module').then(m => m.KustoModule),
  },
  {
    icon: AppIcon.ItemBan,
    tool: NavbarTool.ServiceManagement,
    accessList: CommonAccessLevels.OldNavbarAppOnly,
    title: 'Auction House Blocklist',
    subtitle: 'A support agent tool',
    imageUrl: undefined,
    imageAlt: undefined,
    tooltipDescription: 'Manage the list of cars blocked on the Auction House',
    shortDescription: [`Manage the list of cars blocked on the Auction House`],
    loadChildren: () =>
      import('../../app/pages/navbar-app/pages/service-management/service-management.module').then(
        m => m.StewardServiceManagementModule,
      ),
  },
  {
    icon: AppIcon.Admin,
    tool: NavbarTool.Messaging,
    accessList: CommonAccessLevels.OldCommunityAndNavbarAppOnly,
    title: 'Messaging',
    subtitle: 'A support agent tool',
    imageUrl: undefined,
    imageAlt: undefined,
    tooltipDescription: 'Send in-game messages to players by Gamertags, XUIDs, or LSP Group',
    shortDescription: [`Send in-game messages to players by Gamertags, XUIDs, or LSP Group`],
    loadChildren: () =>
      import('../../app/shared/pages/community-messaging/community-messaging.module').then(
        m => m.CommunityMessagingModule,
      ),
  },
  {
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
  {
    icon: AppIcon.DeveloperTool,
    tool: NavbarTool.DataObligation,
    accessList: CommonAccessLevels.DataPipelineAppOnly,
    title: 'Obligation',
    subtitle: 'A data pipeline tool',
    imageUrl: undefined,
    imageAlt: undefined,
    tooltipDescription: 'Configure Data Activity processing',
    shortDescription: [`Configure Data Activity processing`],
    loadChildren: () =>
      import('../../app/pages/data-pipeline-app/pages/obligation/obligation.module').then(
        m => m.DataPipelineObligationModule,
      ),
  },
  {
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
  {
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
