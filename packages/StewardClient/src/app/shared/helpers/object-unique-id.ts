/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { isUndefined } from 'lodash';

let id = 0;

/** Gets the unique ID for an object. Applies an ID for the object if it doesn't already have one. */
export function objectUniqueId(object: any): number {
  if (!object) {
    return null;
  }

  if (isUndefined(object.__uniqueid)) {
    object.__uniqueid = ++id;
  }

  return object.__uniqueid;
}
