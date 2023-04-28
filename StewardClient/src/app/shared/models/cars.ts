import BigNumber from 'bignumber.js';
import { DateTime } from 'luxon';

/** Interface for a detailed car. */
export interface SimpleCar {
  id: BigNumber;
  makeId: BigNumber;
  make: string;
  model: string;
  year?: string;
  displayName: string;

  // Client only property that is used to to define a car make only and ignore model properties.
  makeOnly: boolean;
}

/** Interface for a detailed car. */
export interface DetailedCar extends SimpleCar {
  aspirationTypeId: BigNumber;
  mediaName: string;
  isPurchased: boolean;
  isUnicorn: boolean;
  familySpecialID: BigNumber;
  regionID: BigNumber;
  countryID: BigNumber;
  notAvailableInAutoshow?: BigNumber;
  enginePlacementID?: BigNumber;
  powertrainID?: BigNumber;
  classID?: BigNumber;
  carTypeID?: BigNumber;
  familyModelID?: BigNumber;
  baseRarity?: BigNumber;
  baseCost?: BigNumber;
  performanceIndex?: BigNumber;
  powertrainName?: string;
  carTypeName?: string;
  carClassName?: string;
  regionName?: string;
  series?: BigNumber;
  releaseDateUtc?: DateTime;
}
