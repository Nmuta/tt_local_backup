import { GameTitleCodeName } from '@models/enums';

/** Gets the given title's master inventory list. */
export class GetMasterInventoryList {
  public static readonly type = '[GiftingMasterListMemory] Get Master Inventory List';
  constructor(
    public readonly title: GameTitleCodeName,
    public readonly gameSettingsId?: string, // Only used when title is Gravity
  ) {}
}
