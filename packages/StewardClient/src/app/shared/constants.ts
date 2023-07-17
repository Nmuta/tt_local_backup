import { DateTime, DurationObject } from 'luxon';

/**
 * Gift history antecedent used to provide type of player identifier.
 * NOTE: This matches API enum model. Do not change unless you're absolutely certain.
 */
export enum GiftIdentityAntecedent {
  Xuid = 'Xuid',
  T10Id = 'T10Id',
  LspGroupId = 'LspGroupId',
}

/** Useful email addresses. */
export enum EmailAddresses {
  LiveOpsAdmins = 't10liveopstools@microsoft.com',
}

/** Minimum calendar datetime when data contains null. */
export const MIN_CALENDAR_DATETIME = DateTime.utc().minus({ years: 2 } as DurationObject);

/** Maximum calendar datetime when data contains null. */
export const MAX_CALENDAR_DATETIME = DateTime.utc().plus({ years: 2 } as DurationObject);
