/** Interface for opus car item. */
export interface OpusCar {
  vin: string;
  baseCost: BigInt;
  carId: BigInt;
  dateCreatedUtc: unknown;
  displayName: string;
  special: string;
  versionedLiveryId: unknown;
  versionedTuneId: unknown;
}
