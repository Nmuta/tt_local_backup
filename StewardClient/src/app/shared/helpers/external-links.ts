import {
  HomeTileInfo,
  HomeTileModifiersUnion,
  isHomeTileInfoExternal,
} from '@environments/environment';

/** Extended HomeTileInfo for navigation usages. */
export type HomeTileInfoForNav = HomeTileInfo &
  Partial<HomeTileModifiersUnion> & { target: string };

/** Sets target property on external links. Internal links are returned with default target value. */
export function setExternalLinkTarget(tool: HomeTileInfo): HomeTileInfoForNav {
  const updatedTool = tool as HomeTileInfoForNav;
  updatedTool.target = isHomeTileInfoExternal(tool) ? '_blank' : '_self';

  return updatedTool;
}
