import { HomeTileInfo, isHomeTileInfoExternal } from '@environments/environment';

/** Extended HomeTileInfo for navigation usages. */
export type HomeTileInfoForNav = HomeTileInfo & { target: string };

/** Sets target property on external links. Internal links are returned with default target value. */
export function setExternalLinkTarget(
  tool: HomeTileInfo,
  isInZendesk: boolean,
): HomeTileInfoForNav {
  const updatedTool = tool as HomeTileInfoForNav;
  updatedTool.target = '_self';

  if (isHomeTileInfoExternal(tool) && isInZendesk) {
    updatedTool.target = '_blank';
    return updatedTool;
  }

  return updatedTool;
}
