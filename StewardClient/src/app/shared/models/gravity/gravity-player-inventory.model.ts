import { GuidLikeString } from '@models/extended-types';
import { PlayerInventoryItem } from '@models/player-inventory-item';
import { GravityBaseInventory } from './gravity-base-inventory.model';

/** Type for Gravity player inventory beta. */
export type GravityPlayerInventory = GravityBaseInventory<PlayerInventoryItem> & {
  gameSettingsId: GuidLikeString;
  externalProfileId: GuidLikeString;
};
