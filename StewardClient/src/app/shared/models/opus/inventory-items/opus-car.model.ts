import { GuidLikeString } from '@models/extended-types';

/** Interface for opus car item. */
export interface OpusCar {
  vin: GuidLikeString;
  baseCost: bigint;
  carId: bigint;
  dateCreatedUtc: Date;
  displayName: string;
  special: 'Unicorn' | '';
  versionedLiveryId: GuidLikeString;
  versionedTuneId: GuidLikeString;
}
