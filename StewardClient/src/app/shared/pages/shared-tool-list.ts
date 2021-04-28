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
}
