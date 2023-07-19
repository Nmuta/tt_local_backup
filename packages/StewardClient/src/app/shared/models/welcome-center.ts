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
  PatchNotes = 'PatchNotes',
  Rivals = 'Rivals',
  Store = 'Store',
}

/** Represent the setting type a builder's cup tile can have */
export enum BuildersCupSettingType {
  Homepage = 'Homepage',
  Series = 'Series',
  Ladder = 'Ladder',
}

/** Represent the setting type a rivals tile can have */
export enum RivalsSettingType {
  Homepage = 'Homepage',
  Event = 'Event',
  Category = 'Category',
}

/** Represent the setting type a showroom tile can have */
export enum ShowroomSettingType {
  Homepage = 'Homepage',
  Car = 'Car',
  Manufacturer = 'Manufacturer',
}

/** Represent the setting type a store tile can have */
export enum StoreSettingType {
  Homepage = 'Homepage',
  Product = 'Product',
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

/** Interface for a custom timer instance date */
export interface CustomRangePoint {
  dateUtc: string;
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

/** Base interface for a display condition. */
export interface DisplayConditionItem {
  refId: string;
  when: string;
}

/** Base interface for a display conditions wrapper. */
export interface TileDisplayCondition {
  item: DisplayConditionItem[];
}

/** Base class for a deeplink destination. */
export class DeeplinkDestination {
  destinationType: DestinationType;
}

/** Builders Cup Deeplink Destination. */
export class BuildersCupDestination extends DeeplinkDestination {
  settingType: BuildersCupSettingType;
  championship: string;
  ladder: string;
  series: string;
}

/** Racers Cup Deeplink Destination. */
export class RacersCupDestination extends DeeplinkDestination {
  series: string;
}

/** Rivals Deeplink Destination. */
export class RivalsDestination extends DeeplinkDestination {
  settingType: RivalsSettingType;
  category: string;
  event: string;
}

/** Showroom Deeplink Destination. */
export class ShowroomDestination extends DeeplinkDestination {
  settingType: ShowroomSettingType;
  car: string;
  manufacturer: string;
}

/** Store Deeplink Destination. */
export class StoreDestination extends DeeplinkDestination {
  settingType: StoreSettingType;
  product: string;
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
  displayConditions: TileDisplayCondition;
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
  destination: DeeplinkDestination;
}

/** Interface that represents a mapping of  welcome center tile friendly name to guid IDs. */
export type FriendlyNameMap = Map<GuidLikeString, string>;
