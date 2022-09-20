import { LocalizationCategory } from './enums';
import { GuidLikeString } from './extended-types';

/**
 * Interface that represents data used to localize a string.
 */
export interface LocalizedStringData {
  stringToLocalize: string;
  description: string;
  category: LocalizationCategory;
  //maxLength: - Probably use a hardcoded value internally in the API. Let's start with 512 and go from there.
}

/**
 * Interface that represents a localized string.
 */
export interface LocalizedString {
  message: string;
  category: LocalizationCategory;
  languageCode: string;
  translated: boolean;
}

/**
 * Interface that represents a mapping of guid IDs to localized string info.
 */
export type LocalizedStringsRecord = Record<GuidLikeString, LocalizedString[]>;
