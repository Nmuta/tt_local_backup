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
    [NavbarTool.Zendesk]: 'https://forzasupport1570048282.zendesk.com/agent',
    [NavbarTool.Sprinklr]: 'https://app.sprinklr.com/ui/app-redirect',
    [NavbarTool.Pegasus]: 'https://cms.services.forzamotorsport.net/',
    [NavbarTool.AdminFH5]: 'https://admin.fh5.forzamotorsport.net/UserDetails.aspx',
    [NavbarTool.AdminFH5Studio]:
      'https://woodstockadmin-final.dev.services.forzamotorsport.net/UserDetails.aspx',
    [NavbarTool.AdminFH4]: 'https://admin.fh4.forzamotorsport.net/UserDetails.aspx',
    [NavbarTool.AdminFM7]: 'https://admin.fm7.forzamotorsport.net/Pages/UserDetails.aspx',
  },
  dev: <ExternalToolUrls>{
    [NavbarTool.Salus]: 'https://gamingmoderation.azureedge.net/#/dashboard',
    [NavbarTool.Zendesk]: 'https://forzasupport1570048282.zendesk.com/agent',
    [NavbarTool.Sprinklr]: 'https://app.sprinklr.com/ui/app-redirect',
    [NavbarTool.Pegasus]: 'https://cms.services.forzamotorsport.net/',
    [NavbarTool.AdminFH5]: 'https://admin.fh5.forzamotorsport.net/UserDetails.aspx',
    [NavbarTool.AdminFH5Studio]:
      'https://woodstockadmin-final.dev.services.forzamotorsport.net/UserDetails.aspx',
    [NavbarTool.AdminFH4]: 'https://admin.fh4.forzamotorsport.net/UserDetails.aspx',
    [NavbarTool.AdminFM7]: 'https://admin.fm7.forzamotorsport.net/Pages/UserDetails.aspx',
  },
  prod: <ExternalToolUrls>{
    [NavbarTool.Salus]: 'https://gamingmoderation.azureedge.net/#/dashboard',
    [NavbarTool.Zendesk]: 'https://support.forzamotorsport.net/agent',
    [NavbarTool.Sprinklr]: 'https://app.sprinklr.com/ui/app-redirect',
    [NavbarTool.Pegasus]: 'https://cms.services.forzamotorsport.net/',
    [NavbarTool.AdminFH5]: 'https://admin.fh5.forzamotorsport.net/UserDetails.aspx',
    [NavbarTool.AdminFH5Studio]:
      'https://woodstockadmin-final.dev.services.forzamotorsport.net/UserDetails.aspx',
    [NavbarTool.AdminFH4]: 'https://admin.fh4.forzamotorsport.net/UserDetails.aspx',
    [NavbarTool.AdminFM7]: 'https://admin.fm7.forzamotorsport.net/Pages/UserDetails.aspx',
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
