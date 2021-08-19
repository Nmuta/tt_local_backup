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
}

export interface HomeTileInfo {
  readonly icon: string;
  readonly tool: NavbarTool;
  readonly title: string;
  readonly subtitle: string;
  readonly imageUrl?: string;
  readonly imageAlt?: string;

  /** A short description for tooltips linking to this tool. */
  readonly tooltipDescription: string;

  /** A short description for the home page. Each element is a paragraph. */
  readonly shortDescription: string[];

  // readonly routerLink: string[];
  readonly loadChildren: LoadChildren;

  /** The list of roles allowed access to this tool. */
  readonly accessList: UserRole[];
  // inNav: boolean;
}

export const toolList: HomeTileInfo[] = [
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
    loadChildren: () =>
      import('../../app/pages/community-app/pages/ugc/ugc.module').then(m => m.UGCModule),
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
    accessList: CommonAccessLevels.OldNavbarAppOnly,
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
];

function allToolsForRole(role: UserRole): Partial<Record<NavbarTool, number>> {
  return chain(toolList)
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
