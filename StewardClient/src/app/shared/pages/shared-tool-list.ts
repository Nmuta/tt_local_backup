import { RouteParams } from '@models/routing';

/** Constants for shared tooling pages. */
export class SharedNavbarTools {
  /** The gifting tool page. */
  public static readonly GiftingPage: RouteParams = {
    title: 'Gifting',
    path: 'gifting',
  };

  /** The Steward User History tool page. */
  public static readonly StewardUserHistoryPage: RouteParams = {
    title: 'Steward User History',
    path: 'steward-user-history',
  };

  /** The bulk ban history tool page. */
  public static readonly BulkBanHistoryPage: RouteParams = {
    title: 'Bulk Ban History',
    path: 'bulk-ban-history',
  };

  /** The home page for the community app. */
  public static readonly UGCPage: RouteParams = {
    title: 'UGC',
    path: 'ugc',
  };

  /** The user details tool page. */
  public static readonly UserDetailsPage: RouteParams = {
    title: 'Player Details',
    path: 'user-details',
  };

  /** The gift history tool page. */
  public static readonly GiftHistoryPage: RouteParams = {
    title: 'Gift History',
    path: 'gift-history',
  };

  /** The user banning tool page. */
  public static readonly UserBanningPage: RouteParams = {
    title: 'Banning',
    path: 'user-banning',
  };

  /** The auction blocklist page. */
  public static readonly AuctionBlocklistPage: RouteParams = {
    title: 'Auction Blocklist',
    path: 'auction-blocklist',
  };

  /** The Kusto tool page. */
  public static readonly KustoPage: RouteParams = {
    title: 'Kusto',
    path: 'kusto',
  };

  /** The kusto management tool page. */
  public static readonly KustoManagementPage: RouteParams = {
    title: 'Kusto Management',
    path: 'kusto-management',
  };

  /** The home page for the data pipeline app. */
  public static readonly ObligationPage: RouteParams = {
    title: 'Obligation',
    path: 'obligation',
  };

  /** The notification management tool page. */
  public static readonly NotificationsPage: RouteParams = {
    title: 'Notifications',
    path: 'notifications',
  };
}
