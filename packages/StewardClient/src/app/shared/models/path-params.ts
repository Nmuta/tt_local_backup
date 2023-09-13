import { ActivatedRoute } from '@angular/router';
import { tryParseBigNumber } from '@helpers/bignumbers';
import BigNumber from 'bignumber.js';

/** Enum for all path param strings used in Steward. */
export enum PathParams {
  CarId = 'carId',
  LiveryId = 'liveryId',
  BountyId = 'bountyId',
}

/** Functions that parse path params to their expected type. Else returns null. */
export const ParsePathParamFunctions = {
  [PathParams.CarId]: (route: ActivatedRoute): BigNumber =>
    tryParseBigNumber(route.snapshot.params[PathParams.CarId]),
  [PathParams.LiveryId]: (route: ActivatedRoute): string =>
    route.snapshot.queryParams[PathParams.LiveryId],
  [PathParams.BountyId]: (route: ActivatedRoute): string =>
    route.snapshot.params[PathParams.BountyId],
};
