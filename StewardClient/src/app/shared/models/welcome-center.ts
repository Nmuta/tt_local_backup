import { GuidLikeString } from './extended-types';

/** Values capitalized to match Pegasus response */
export enum WelcomeCenterTileSize {
  Medium = 'Medium',
  Large = 'Large',
}

export enum TileType {
  None = 'None',
  ImageText = 'ImageText',
  GenericPopup = 'GenericPopup',
  Deeplink = 'Deeplink',
}

/** Represent destination a deeplink tile can have */
export enum DestinationType {
  RacersCup = 'RacersCup',
  BuildersCup = 'BuildersCup',
  Showroom = 'Showroom',
}

/** Represent the setting type a builder's cup tile can have */
export enum BuildersCupSettingType {
  Homepage = 'Homepage',
  Series = 'Series',
  Ladder = 'Ladder',
}

/** Timer type */
export enum TimerType {
  ToStartOrToEnd = 'ToStartOrToEnd',
  ToEnd = 'ToEnd',
  ToStart = 'ToStart',
}

/** Timer instance as saved in the xml */
export enum TimerInstance {
  Ladder = 'WorldOfForza.TileTimerLadder',
  Season = 'WorldOfForza.TileTimerSeason',
  Chapter = 'WorldOfForza.TileTimerChapter',
  Series = 'WorldOfForza.TileTimerSeries',
  Custom = 'WorldOfForza.TileTimerCustom',
}

/** Timer reference type for the reference object */
export enum TimerReferenceInstance {
  Ladder = 'Ladder',
  Series = 'Series',
  Season = 'Season',
  Chapter = 'Chapter',
}

/** Interface for a localized text object integrated in a welcome center tile. */
export interface LocalizedText {
  skipLoc: string;
  base: string;
  description: string;
  locdef: string;
  locref: string;
}

/** Interface for a timer loc string override */
export interface TextOverride {
  refId: string;
}

/** Interface for a custom timer instance date. Text is a date as string */
export interface CustomRangePoint {
  text: string;
  when: string;
}

/** Interface for a custom timer instance */
export interface CustomRange {
  from: CustomRangePoint;
  to: CustomRangePoint;
}

/** Interface for a timer reference. RefId can be a Season, Chapter, etc Guid */
export interface TimerReference {
  refId: string;
  timerInstance: TimerReferenceInstance;
}

/** Base interface for a welcome center timer. */
export interface Timer {
  timerType: TimerType;
  typeName: TimerInstance;
  startTextOverride: TextOverride;
  endTextOverride: TextOverride;
  customRange: CustomRange;
  timerReference: TimerReference;
}

/** Base interface for a welcome center tile. */
export interface WelcomeCenterTile {
  friendlyName: string;
  size: WelcomeCenterTileSize;
  tileTitle: LocalizedText;
  tileType: LocalizedText;
  tileDescription: LocalizedText;
  tileImagePath: string;
  timer: Timer;
  derivedType?: TileType;
}

/** Interface for a image text tile. */
export interface ImageTextTile extends WelcomeCenterTile {
  contentImagePath: string;
}

/** Interface for a generic popup tile. */
export interface GenericPopupTile extends WelcomeCenterTile {
  popupTitle: LocalizedText;
  popupDescription: LocalizedText;
}

/** Interface for a deeplink tile. */
export interface DeeplinkTile extends WelcomeCenterTile {
  category: string;
  championship: string;
  ladder: string;
  series: string;
  destinationType: DestinationType;
  buildersCupSettingType: BuildersCupSettingType;
}

/** Interface that represents a mapping of  welcome center tile friendly name to guid IDs. */
export type FriendlyNameMap = Map<GuidLikeString, string>;
