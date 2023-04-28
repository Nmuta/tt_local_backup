import { Type } from '@angular/core';
import { LoadChildren } from '@angular/router';
import { GameTitle } from '@models/enums';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { PermAttributesService } from '@services/perm-attributes/perm-attributes.service';
import { NavbarTool } from './navbar-tool';

/** Base model for Home Tiles. */
export interface HomeTileInfoBase {
  /** The primary icon that is displayed alongside this tool's title. As in the top-level of the tiles. */
  readonly icon: string;

  /** The icon that is displayed alongside this tool's link. As in links that open to an external tool. */
  readonly extraIcon?: string;

  /** The slug identifier of the tool. */
  readonly tool: NavbarTool;

  /** Previous tool routes. Used to generate redirects to the canonical {@link HomeTileInfoBase.tool} route. */
  readonly oldToolRoutes?: string[];

  /** The displayed title of the tool. As in the navbar and card titles. Should be very short. */
  readonly title: string;

  /** The displayed subtitle of the tool. As below the card title. Should be quite short. */
  readonly subtitle: string;

  /** The game titles this tool supports. */
  readonly supportedTitles: GameTitle[];

  /** All of the permission attributes required to make full use of this tool. */
  readonly allPermissions: PermAttributeName[];

  /** A URL to an image that represents this tool. As displayed at the top of the card body. */
  readonly imageUrl?: string;

  /** Alt text describing the image that represents this tool. */
  readonly imageAlt?: string;

  /** A short description for tooltips linking to this tool. */
  readonly tooltipDescription: string;

  /** A short description for the home page. Each element is a paragraph. */
  readonly shortDescription: string[];

  /** V2 Auth Restriction: */
  readonly restriction?: HomeTileRestriction;
}

/** Tile restriction types. */
export enum HomeTileRestrictionType {
  Disable,
  Hide,
}

/** Defines tool tile restriction if user does not have all required perm attributes. */
export interface HomeTileRestriction {
  requiredPermissions: PermAttributeName[];
  action: HomeTileRestrictionType;
}

/** Type for a custom tile. */
export type CustomTileComponent = { disabled: boolean; item: HomeTileInfo };

/** Model for Home Tiles that send the user to internal tools. */
export interface HomeTileInfoCustomTile extends HomeTileInfoBase {
  /** Component to render below the tile summary. */
  readonly tileContentComponent?: () => Promise<Type<CustomTileComponent>>;
  /** Component to render in the nav instead of the usual link. */
  readonly navComponent?: () => Promise<Type<CustomTileComponent>>;
  /** Component to render as the tile action instead of the usual button. */
  readonly tileActionComponent?: () => Promise<Type<CustomTileComponent>>;

  /** When true, disables the "open" link. */
  readonly hideLink?: true;
}

/** Model for Home Tiles that send the user to internal tools. */
export interface HomeTileInfoInternal extends HomeTileInfoBase {
  /** Angular hook which chooses the target module for lazy-loading. */
  readonly loadChildren: LoadChildren;
}

/** Model for Home Tiles that send the user to external tools. */
export interface HomeTileInfoExternal extends HomeTileInfoBase {
  /** Target URL for opening a link in a new tab. */
  externalUrl: string;
}

/** A single e ntry in an external URL dropdown entry. */
export interface ExternalUrlDropdownEntry {
  text: string;
  tooltip?: string;
  icon?: string;
  url: string;
}

/** Model for Home Tiles that send the user to external tools. */
export interface HomeTileInfoMultiExternal extends HomeTileInfoBase {
  /** Target URLs for opening a link in a new tab. */
  externalUrls: ExternalUrlDropdownEntry[];
}

/** Union type for home tiles. */
export type HomeTileInfoCore =
  | HomeTileInfoInternal
  | HomeTileInfoExternal
  | HomeTileInfoCustomTile
  | HomeTileInfoMultiExternal;

/** Intersection type for all possible home-tile tweaks. */
export type HomeTileModifiersIntersection = HomeTileInfoCustomTile;

/** Union type for all possible home-tile tweaks. */
export type HomeTileModifiersUnion = HomeTileInfoCustomTile;

/** Union type for home tiles. */
// eslint-disable-next-line @typescript-eslint/ban-types
export type HomeTileInfo = HomeTileInfoCore & ({} | HomeTileModifiersIntersection);

/** True if the given tile is an external tool. */
export function isHomeTileInfoExternal(
  homeTileInfo: HomeTileInfo,
): homeTileInfo is HomeTileInfoExternal {
  return !!(homeTileInfo as HomeTileInfoExternal).externalUrl;
}
/** True if the given tile handles multiple external tools. */
export function isHomeTileInfoMultiExternal(
  homeTileInfo: HomeTileInfo,
): homeTileInfo is HomeTileInfoMultiExternal {
  return !!(homeTileInfo as HomeTileInfoMultiExternal).externalUrls;
}

/** True if the given tile is an internal tool. */
export function isHomeTileInfoInternal(
  homeTileInfo: HomeTileInfo,
): homeTileInfo is HomeTileInfoInternal {
  return !!(homeTileInfo as HomeTileInfoInternal).loadChildren;
}

/** Verifies the home tile's Auth V2 restrictions. Must has all of the required permissions in at least one game title. */
export function hasRequiredPermissions(
  tile: HomeTileInfoBase,
  permAttributesService: PermAttributesService,
): boolean {
  if (!tile?.restriction || tile?.restriction?.requiredPermissions?.length <= 0) {
    return true;
  }

  const checkRequiredPermissions = tile?.restriction.requiredPermissions.map(perm => {
    const gameTitles = tile.supportedTitles;
    if (!gameTitles || gameTitles?.length <= 0) {
      return permAttributesService.hasFeaturePermission(perm);
    }

    return gameTitles
      .map(title => permAttributesService.hasFeaturePermission(perm, title))
      .includes(true);
  });

  return !checkRequiredPermissions.includes(false);
}
