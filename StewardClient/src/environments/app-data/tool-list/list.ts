import { HomeTileInfo } from './helpers';
import {
  adminPagesExternalDropdownTile,
  auctionBlocklistTile,
  auctionCreateTile,
  auctionDetailsTile,
  banHistoryTile,
  banningTile,
  carDetailsTile,
  endpointsWidgetTile,
  giftHistoryTile,
  giftingTile,
  kustoTile,
  leaderboardsTile,
  messagingTile,
  metaToolsInternalTile,
  motdTile,
  obligationsTile,
  pegasusExternalTile,
  permissionManagementInternalTile,
  playerInfoTile,
  powerBIExternalDropdownTile,
  racersCupTile,
  buildersCupCalendarTile,
  salusExternalTile,
  sprinklrExternalTile,
  stewardUserHistoryTile,
  themeingWidgetTile,
  ugcDetailsTile,
  ugcSearchTile,
  userGroupManagementTile,
  welcomeCenterCalendarTile,
  welcomeCenterTile,
  zendeskExternalTile,
} from './tiles';

/** The unprocessed tool list. Use @see environment.tools instead. */
export const unprocessedToolList: HomeTileInfo[] = [
  playerInfoTile,

  banningTile,
  banHistoryTile,

  giftingTile,
  giftHistoryTile,

  ugcSearchTile,
  ugcDetailsTile,

  auctionDetailsTile,
  auctionBlocklistTile,
  auctionCreateTile,

  carDetailsTile,

  motdTile,
  messagingTile,
  welcomeCenterTile,

  kustoTile,
  stewardUserHistoryTile,
  obligationsTile,

  leaderboardsTile,
  racersCupTile,
  buildersCupCalendarTile,
  welcomeCenterCalendarTile,

  userGroupManagementTile,

  salusExternalTile,
  zendeskExternalTile,
  sprinklrExternalTile,
  pegasusExternalTile,

  adminPagesExternalDropdownTile,
  powerBIExternalDropdownTile,

  themeingWidgetTile,
  endpointsWidgetTile,

  permissionManagementInternalTile,
  metaToolsInternalTile,
];
