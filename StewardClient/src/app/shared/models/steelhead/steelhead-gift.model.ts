import {
  BulkLiveryGift,
  ExpirableGift,
  ExpirableGroupGift,
  LocalizedMessageExpirableGift,
} from '@models/gift';
import { SteelheadMasterInventory } from './steelhead-master-inventory.model';

/** Interface for an Steelhead gift. */
export interface SteelheadGift extends LocalizedMessageExpirableGift {
  inventory: SteelheadMasterInventory;
}

/** Model for multi-player multi-livery gift. */
export type SteelheadBulkPlayerBulkLiveryGift = BulkLiveryGift<ExpirableGroupGift>;

/** Model for user group multi-livery gift. */
export type SteelheadUserGroupBulkLiveryGift = BulkLiveryGift<ExpirableGift>;
