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
  unifiedCalendarTile,
  salusExternalTile,
  sprinklrExternalTile,
  stewardUserHistoryTile,
  themeingWidgetTile,
  ugcDetailsTile,
  ugcSearchTile,
  userGroupManagementTile,
  welcomeCenterTile,
  zendeskExternalTile,
  servicesTableStorageTile,
  acLogReaderTile,
  productPricingTile,
  playFabTile,
  lspTasksTile,
  bountySearchTile,
  bountyDetailsTile,
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

  bountySearchTile,
  bountyDetailsTile,

  motdTile,
  messagingTile,
  welcomeCenterTile,

  kustoTile,
  servicesTableStorageTile,
  stewardUserHistoryTile,
  obligationsTile,

  leaderboardsTile,
  unifiedCalendarTile,

  userGroupManagementTile,

  playFabTile,
  acLogReaderTile,
  productPricingTile,

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
  lspTasksTile,
];
