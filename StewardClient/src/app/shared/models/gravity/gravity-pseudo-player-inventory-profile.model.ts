import { GuidLikeString } from '@models/extended-types';
import { chain } from 'lodash';
import { GravityPlayerDetails } from './gravity-player-details.model';

export interface GravityPseudoPlayerInventoryProfile {
  profileId: GuidLikeString;
  externalProfileId: GuidLikeString;
  isCurrent: boolean;

  userInventoryId: GuidLikeString;
  lastLoginUtc: Date;
}

/** Converts a gravity details object (with save state) into a value closely resembling other Inventory Profile formats. */
export function gravitySaveStatesToPsuedoInventoryProfile(details: GravityPlayerDetails): GravityPseudoPlayerInventoryProfile[] {
  return chain(details.saveStates).sortBy(profile => profile.lastLoginUtc).reverse().map(saveState => {
    return {
      profileId: saveState.userInventoryId,
      isCurrent: saveState.userInventoryId === details.userInventoryId,
      lastLoginUtc: saveState.lastLoginUtc,
      userInventoryId: saveState.userInventoryId,
      externalProfileId: saveState.userInventoryId,
    }
  }).value();
}