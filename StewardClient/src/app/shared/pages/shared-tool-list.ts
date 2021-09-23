import { RouteParams } from '@models/routing';

/** Constants for shared tooling pages. */
export class SharedNavbarTools {
  /** The gifting tool page. */
  public static readonly GiftingPage: RouteParams = {
    title: 'Gifting',
    path: 'gifting',
  };

  /** The messaging tool page. */
  public static readonly MessagingPage: RouteParams = {
    title: 'Messaging',
    path: 'messaging',
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
}
