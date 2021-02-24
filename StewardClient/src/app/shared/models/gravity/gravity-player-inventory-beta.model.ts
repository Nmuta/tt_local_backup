import { GuidLikeString } from '@models/extended-types';
import { GravityMasterInventory } from './gravity-master-inventory.model';

/** Interface for Gravity player inventory beta. */
export interface GravityPlayerInventoryBeta extends GravityMasterInventory {
  gameSettingsId: GuidLikeString;
  externalProfileId: GuidLikeString;
}
