import { DateTime } from 'luxon';
import { GuidLikeString } from './extended-types';
import { CustomRangePoint, TileDisplayCondition } from './welcome-center';

/** Base interface for a cooldown wrapper. */
export interface CooldownsWrapper {
  item: CooldownItem[];
}

/** Base interface for a cooldown. */
export interface CooldownItem {
  id: string;
  refId: string;
  when: string;
  type: string;
  friendlyName: string;
  settings: CooldownSettings;
}

/** Base interface for a cooldown settings. */
export interface CooldownSettings {
  resetDates: ResetDates;
}

/** Base interface for reset dates. */
export interface ResetDates {
  item: CustomRangePoint[];
}

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
  displayConditions: TileDisplayCondition;
  cooldowns: CooldownsWrapper;
}

/** Interface that represents a mapping of  message of the day friendly name to guid IDs. */
export type FriendlyNameMap = Map<GuidLikeString, string>;
