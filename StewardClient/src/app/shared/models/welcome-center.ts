import { GuidLikeString } from './extended-types';

/** Values capitalized to match Pegasus response */
export enum WelcomeCenterTileSize {
  Medium = 'Medium',
  Large = 'Large',
}

/** Interface for a localized text object integrated in a welcome center tile. */
export interface LocalizedText {
  skipLoc: string;
  base: string;
  description: string;
  locdef: string;
  locref: string;
}

/** Interface for a welcome center tile. */
export interface WelcomeCenterTile {
  friendlyName: string;
  size: WelcomeCenterTileSize;
  tileTitle: LocalizedText;
  tileType: LocalizedText;
  tileDescription: LocalizedText;
  contentImagePath: string;
  tileImagePath: string;
}

/** Interface that represents a mapping of  welcome center tile friendly name to guid IDs. */
export type FriendlyNameMap = Map<GuidLikeString, string>;
