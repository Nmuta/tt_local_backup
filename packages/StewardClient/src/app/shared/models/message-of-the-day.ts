import { DateTime } from 'luxon';
import { GuidLikeString } from './extended-types';

/** Interface for a localized text object integrated in a message of the day. */
export interface LocalizedText {
  skipLoc: string;
  base: string;
  description: string;
  locdef: string;
  locref: string;
}

/** Interface for a message of the day. */
export interface MessageOfTheDay {
  friendlyMessageName: string;
  titleHeader: LocalizedText;
  contentHeader: LocalizedText;
  contentBody: LocalizedText;
  contentImagePath: string;
  date: DateTime;
}

/** Interface that represents a mapping of  message of the day friendly name to guid IDs. */
export type FriendlyNameMap = Map<GuidLikeString, string>;
