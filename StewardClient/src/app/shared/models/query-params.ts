import { ActivatedRoute } from '@angular/router';
import { tryParseBigNumber } from '@helpers/bignumbers';
import BigNumber from 'bignumber.js';

/** Enum for all query param strings used in Steward. */
export enum QueryParam {
  UserGroup = 'userGroup',
}

/** Functions that parse query params to their expected type. Else returns null. */
export const ParseQueryParamFunctions = {
  [QueryParam.UserGroup]: (route: ActivatedRoute): BigNumber =>
    tryParseBigNumber(route.snapshot.queryParams[QueryParam.UserGroup]),
};
