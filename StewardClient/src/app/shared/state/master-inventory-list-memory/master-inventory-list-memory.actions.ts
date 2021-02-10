/** Gets gravity's master inventory list. */
export class GetGravityMasterInventoryList {
  public static readonly type = '[GiftingMasterListMemory] Get Gravity Master Inventory List';
  constructor(public readonly gameSettingsId: string) {}
}

/** Gets sunrise's master inventory list. */
export class GetSunriseMasterInventoryList {
  public static readonly type = '[GiftingMasterListMemory] Get Sunrise Master Inventory List';
  constructor() {
    /** Empty */
  }
}

/** Gets apollo's master inventory list. */
export class GetApolloMasterInventoryList {
  public static readonly type = '[GiftingMasterListMemory] Get Apollo Master Inventory List';
  constructor() {
    /** Empty */
  }
}
