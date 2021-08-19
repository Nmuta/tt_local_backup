import { chain, difference, keys, toPairs } from 'lodash';
import {
  NavbarTool,
  HomeTileInfo,
  HomeTileInfoExternal,
  isHomeTileInfoExternal,
} from './tool-list';

/** External Tool URLs. */
export type ExternalToolUrls = Record<NavbarTool, string>;

/** URLs to external tools. */
export const externalToolUrls = {
  local: <ExternalToolUrls>{
    [NavbarTool.Salus]: 'https://gmx-dev.azureedge.net/#/dashboard',
  },
  dev: <ExternalToolUrls>{
    [NavbarTool.Salus]: 'https://gamingmoderation.azureedge.net/#/dashboard',
  },
  prod: <ExternalToolUrls>{
    [NavbarTool.Salus]: 'https://gamingmoderation.azureedge.net/#/dashboard',
  },
};

/** Overrides *ALL* External Tool URLs in the given HomeTileInfo list with the given replacement URLs. All URLs must exist.*/
export function overrideExternalTools(
  homeTileInfo: HomeTileInfo[],
  replacementUrls: ExternalToolUrls,
): HomeTileInfo[] {
  const externalTileInfo = homeTileInfo.filter(tile => isHomeTileInfoExternal(tile));

  // verify our external tools lists are identical
  const existantToolList = externalTileInfo.map(tile => tile.tool);
  const overrideToolList = keys(replacementUrls);
  const inExistantToolsAndMissingInUrls = difference(existantToolList, overrideToolList);
  const inUrlsAndMissingInExistantTools = difference(overrideToolList, existantToolList);
  if (inExistantToolsAndMissingInUrls.length > 0) {
    throw new Error(`Missing tools in URLs list: ${inExistantToolsAndMissingInUrls.join(', ')}`);
  }
  if (inUrlsAndMissingInExistantTools.length > 0) {
    throw new Error(`Extra tools in URLs list: ${inUrlsAndMissingInExistantTools.join(', ')}`);
  }

  const toolLookup: Partial<Record<NavbarTool, HomeTileInfoExternal>> = chain(externalTileInfo)
    .map(v => [v.tool, v])
    .fromPairs()
    .value();
  for (const pair of toPairs(replacementUrls)) {
    const [tool, url] = pair;
    toolLookup[tool].externalUrl = url;
  }

  return homeTileInfo;
}
