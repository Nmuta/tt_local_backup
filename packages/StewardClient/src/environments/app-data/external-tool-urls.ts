import { chain, difference, keys, toPairs } from 'lodash';
import {
  NavbarTool,
  HomeTileInfo,
  HomeTileInfoExternal,
  isHomeTileInfoExternal,
} from './tool-list';

/** External Tool URLs. */
export type ExternalToolUrls = Record<NavbarTool, string>;

export const StewardDashboard = {
  actions:
    'https://msit.powerbi.com/groups/me/apps/fd78489b-3fe6-4947-9df3-5c810f249b07/reports/b0e0b3d1-44b6-4f36-bc7b-cda5a3ea938a/ReportSection297d5da0c075521c0999',
};

/**
 * URLs to external tools.
 * @deprecated Since we have added dropdown support to tools tiles/nav, we no longer need this.
 */
export const externalToolUrls = {
  local: <ExternalToolUrls>{
    [NavbarTool.Salus]: 'https://gmx-dev.azureedge.net/#/dashboard',
    [NavbarTool.Zendesk]: 'https://forzasupport1570048282.zendesk.com/agent',
    [NavbarTool.Sprinklr]: 'https://app.sprinklr.com/ui/app-redirect',
    [NavbarTool.Pegasus]: 'https://cms.services.forzamotorsport.net/',
  },
  dev: <ExternalToolUrls>{
    [NavbarTool.Salus]: 'https://gamingmoderation.azureedge.net/#/dashboard',
    [NavbarTool.Zendesk]: 'https://forzasupport1570048282.zendesk.com/agent',
    [NavbarTool.Sprinklr]: 'https://app.sprinklr.com/ui/app-redirect',
    [NavbarTool.Pegasus]: 'https://cms.services.forzamotorsport.net/',
  },
  prod: <ExternalToolUrls>{
    [NavbarTool.Salus]: 'https://gamingmoderation.azureedge.net/#/dashboard',
    [NavbarTool.Zendesk]: 'https://support.forzamotorsport.net/agent',
    [NavbarTool.Sprinklr]: 'https://app.sprinklr.com/ui/app-redirect',
    [NavbarTool.Pegasus]: 'https://cms.services.forzamotorsport.net/',
  },
};

/**
 * Overrides *ALL* External Tool URLs in the given HomeTileInfo list with the given replacement URLs. All URLs must exist.
 * @deprecated Since we have added dropdown support to tools tiles/nav, we no longer need this.
 */
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
