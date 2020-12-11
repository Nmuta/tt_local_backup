import { GameTitleCodeName } from '@models/enums';

/** GetUser action declaration. */
export class GetUser {
  public static readonly type = '[User] Get User';
  constructor() {
    // Empty
  }
}

/** ResetUserProfile action declaration. */
export class ResetUserProfile {
  public static readonly type = '[User] Reset User Profile';
  constructor() {
    // Empty
  }
}

/** SetNoUserProfile action declaration. */
export class SetNoUserProfile {
  public static readonly type = '[User] Set No User Profile';
  constructor() {
    // Empty
  }
}

/** RequestAccessToken action declaration. */
export class RequestAccessToken {
  public static readonly type = '[User] Request Access Token';
  constructor() {
    // Empty
  }
}

/** ResetAccessToken action declaration. */
export class ResetAccessToken {
  public static readonly type = '[User] Reset Access Token';
  constructor() {
    // Empty
  }
}

/** Meta action: Logout and redirect as appropriate. */
export class LogoutUser {
  public static readonly type = '[User] Logout';
  constructor(public readonly returnRoute: string) {
    // Empty
  }
}

/** Meta action: Clear auth and grab it again. */
export class RecheckAuth {
  public static readonly type = '[User] Recheck Auth';
  constructor() {
    // Empty
  }
}

/** Meta action: Updates the last gifting page title. */
export class UpdateCurrentGiftingPageTitle {
  public static readonly type = '[User] Update Last Gifting Page Title';
  constructor(public readonly title: GameTitleCodeName) {}
}
