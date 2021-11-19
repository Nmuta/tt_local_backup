import { BigNumber } from 'bignumber.js';
import { DateTime, Duration } from 'luxon';

/** Information about an entry in an object, including multiple displayable names. */
export interface ObjectEntry<T> {
  key: string;
  name: string;
  shortName: string;
  value: T;
}

/** Elements common to all extracted entry sets. */
export interface ExtractedObjectBase<T> {
  /** All entries within this extraction set, in the order they originally appeared. */
  all: ObjectEntry<T>[];

  /** Any entries not captured by another subgroup. */
  other?: ObjectEntry<T>[];
}

/** Various grouped flags extracted from an object. */
export interface ExtractedObjectFlags extends ExtractedObjectBase<boolean> {
  all: ObjectEntry<boolean>[];
  is: ObjectEntry<boolean>[];
  isNot: ObjectEntry<boolean>[];
  was: ObjectEntry<boolean>[];
  wasNot: ObjectEntry<boolean>[];
}

/** Various grouped numbers extracted from an object. */
export interface ExtractedObjectNumbers extends ExtractedObjectBase<BigNumber> {
  all: ObjectEntry<BigNumber>[];
  ids?: ObjectEntry<BigNumber>[];
  xuids?: ObjectEntry<BigNumber>[];
  prices?: ObjectEntry<BigNumber>[];
  amounts?: ObjectEntry<BigNumber>[];
  counts?: ObjectEntry<BigNumber>[];
  other?: ObjectEntry<BigNumber>[];
}

/** Various grouped strings extracted from an object. */
export interface ExtractedObjectStrings extends ExtractedObjectBase<string> {
  all: ObjectEntry<string>[];
  ids?: ObjectEntry<string>[];
  other?: ObjectEntry<string>[];
}

/** Various grouped dates extracted from an object. */
export interface ExtractedObjectDates extends ExtractedObjectBase<DateTime> {
  all: ObjectEntry<DateTime>[];
}

/** Various grouped durations extracted from an object. */
export interface ExtractedObjectDurations extends ExtractedObjectBase<Duration> {
  all: ObjectEntry<Duration>[];
}

/** Container for all values extracted from a given model. */
export interface ExtractedModel {
  extractedFlags: ExtractedObjectFlags;
  extractedNumbers: ExtractedObjectNumbers;
  extractedStrings: ExtractedObjectStrings;
  extractedDates: ExtractedObjectDates;
  extractedDurations: ExtractedObjectDurations;
}
