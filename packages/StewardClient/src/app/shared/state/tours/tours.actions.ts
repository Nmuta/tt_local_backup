/** Sets the Home tour on or off */
export class SetHomeTour {
  public static readonly type = '[Tour] Toggle Home Tour';
  constructor(public readonly enabled: boolean) {}
}

/** Sets all tours on or off */
export class SetUserTours {
  public static readonly type = '[Tour] Toggle All User Tours';
  constructor(public readonly enabled: boolean) {}
}
