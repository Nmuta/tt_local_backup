import {
  LocalizationCategory,
  LocalizationSubCategory,
  SupportedLocalizationLanguageCodes,
} from './enums';
import { GuidLikeString } from './extended-types';

/**
 * Interface that represents data used to localize a string.
 */
export interface LocalizedStringData {
  textToLocalize: string;
  description: string;
  category: LocalizationCategory;
  subCategory: LocalizationSubCategory;
  //maxLength: - Probably use a hardcoded value internally in the API. Let's start with 512 and go from there.
}

/**
 * Interface that represents a localized string.
 */
export interface LocalizedString {
  message: string;
  category: LocalizationCategory;
  languageCode: SupportedLocalizationLanguageCodes;
  isTranslated: boolean;
}

/**
 * Interface that represents a mapping of guid IDs to localized string info.
 */
export type LocalizedStringsMap = Map<GuidLikeString, LocalizedString[]>;
