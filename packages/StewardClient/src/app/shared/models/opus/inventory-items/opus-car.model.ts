import BigNumber from 'bignumber.js';
import { GuidLikeString } from '@models/extended-types';

/** Interface for opus car item. */
export interface OpusCar {
  vin: GuidLikeString;
  baseCost: BigNumber;
  carId: BigNumber;
  dateCreatedUtc: DateTime;
  displayName: string;
  special: 'Unicorn' | '';
  quantity: BigNumber;
  versionedLiveryId: GuidLikeString;
  versionedTuneId: GuidLikeString;
}
