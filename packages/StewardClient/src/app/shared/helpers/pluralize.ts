import BigNumber from 'bignumber.js';
import { isObject, isString } from 'lodash';

export const PLURALIZE_CONFIG = {
  ItemsHave: <PluralizeConfig>{
    includeNumber: true,
    one: 'item has',
    other: 'items have',
  },
};

/** Options for pluralized strings. */
export interface PluralizeConfig {
  /** When true, number is included before string. */
  includeNumber?: boolean;
  /** What to produce when there are zero items. */
  zero?: string;
  /** What to produce when there is one item. */
  one?: string;
  /** What to produce when there are two items. */
  two?: string;
  /** What to produce when there are more items, or when another value is not specified. Default. */
  other?: string;
}

// prettier made this basically unreadable so i disabled it
// prettier-ignore
/** Produces a pluralized string from a number of options and a count. */
export function pluralize(count: number | BigNumber, config: PluralizeConfig);
// prettier-ignore
export function pluralize(count: number | BigNumber, one: string, other: string);
// prettier-ignore
export function pluralize(count: number | BigNumber, zero: string, one: string, other: string);
// prettier-ignore
export function pluralize(count: number | BigNumber, zero: string, one: string, two: string, other: string);
export function pluralize(
  count: number | BigNumber,
  zeroOrOneOrConfig: string | PluralizeConfig,
  oneOrOther?: string,
  twoOrOther?: string,
  other?: string,
): string {
  // config object
  if (isObject(zeroOrOneOrConfig)) {
    return pluralizeInternal(count, zeroOrOneOrConfig);
  }

  // fully specified (zero-one-two-other)
  if (isString(other)) {
    return pluralizeInternal(count, {
      zero: zeroOrOneOrConfig,
      one: oneOrOther,
      two: twoOrOther,
      other,
    });
  }

  // partially specified (zero-one-other)
  if (isString(twoOrOther)) {
    return pluralizeInternal(count, {
      zero: zeroOrOneOrConfig,
      one: oneOrOther,
      other: twoOrOther,
    });
  }

  // partially specified (one-other)
  if (isString(oneOrOther)) {
    return pluralizeInternal(count, {
      one: zeroOrOneOrConfig,
      other: oneOrOther,
    });
  }

  // should never happen if you follow the signatures
  throw new Error('Did not match any expected signature.');
}

/** Produces a pluralized string from a number of options and a count. */
function pluralizeInternal(count: number | BigNumber, config: PluralizeConfig): string {
  const prefix = config.includeNumber ? `${count} ` : '';
  switch (count.toString()) {
    case '0':
      return prefix + (config.zero ?? config.other);
    case '1':
      return prefix + (config.one ?? config.other);
    case '2':
      return prefix + (config.two ?? config.other);
    default:
      return prefix + config.other;
  }
}
