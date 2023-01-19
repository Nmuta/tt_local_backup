import { ONE } from '@helpers/bignumbers';
import { AugmentedCompositeIdentity } from '@views/player-selection/player-selection-base.component';
import BigNumber from 'bignumber.js';

/** Interface for a special user identity. */
export interface SpecialIdentity {
  xuid: BigNumber;
  gamertag: string;
  /** The compositeIdentity is a mock object that will be set as the identity. */
  compositeIdentity: AugmentedCompositeIdentity;
}

/** Special identity object for Xuid 1 ('System'). */
export const SpecialXuid1: SpecialIdentity = {
  xuid: ONE,
  gamertag: 'system',
  compositeIdentity: {
    query: { xuid: ONE },
    general: null,
    woodstock: {
      query: { gamertag: 'System', xuid: ONE },
      gamertag: 'System',
      xuid: ONE,
      error: null,
    },
    forte: null,
    steelhead: null,
    sunrise: null,
    apollo: null,
    opus: null,

    result: null,

    extra: {
      lookupType: 'xuid',
      theme: 'primary',
      isAcceptable: true,
      rejectionReason: null,
      isValid: true,
      isInvalid: false,
      hasForte: false,
      hasWoodstock: true,
      hasSteelhead: false,
      hasSunrise: false,
      hasApollo: false,
      hasOpus: false,
      label: 'W',
      labelTooltip: 'Retail Titles: Woodstock',
    },
  },
};
