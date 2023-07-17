import { BulkLiveryGift, ExpirableGift, ExpirableGroupGift } from '@models/gift';
import { WoodstockMasterInventory } from './woodstock-master-inventory.model';

/** Interface for Woodstock gift. */
export interface WoodstockGift extends ExpirableGift {
  inventory: WoodstockMasterInventory;
}

/** Model for multi-player multi-livery gift. */
export type WoodstockBulkPlayerBulkLiveryGift = BulkLiveryGift<ExpirableGroupGift>;

/** Model for user group multi-livery gift. */
export type WoodstockUserGroupBulkLiveryGift = BulkLiveryGift<ExpirableGift>;
