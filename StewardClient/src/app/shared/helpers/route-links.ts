import { NavbarTool } from '@environments/app-data/tool-list';
import { GameTitle } from '@models/enums';
import { UgcType } from '@models/ugc-filters';

/** Make component base route from a component name and game title. */
function getComponentBaseRoute(componentName: NavbarTool, gameTitle: GameTitle) {
  return [`/app/tools/${componentName}/`, gameTitle];
}

/** Make auction blocklist route. */
export function getAuctionBlocklistRoute(gameTitle: GameTitle) {
  return getComponentBaseRoute(NavbarTool.AuctionBlocklist, gameTitle);
}

/** Make gift history route. */
export function getGiftHistoryRoute(gameTitle: GameTitle) {
  return getComponentBaseRoute(NavbarTool.GiftHistory, gameTitle);
}

/** Make gifting route. */
export function getGiftRoute(gameTitle: GameTitle) {
  return getComponentBaseRoute(NavbarTool.Gifting, gameTitle);
}

/** Make leaderboard route. */
export function getLeaderboardRoute(gameTitle: GameTitle) {
  return getComponentBaseRoute(NavbarTool.Leaderboards, gameTitle);
}

/** Make ugc search route. */
export function getUgcSearchRoute(gameTitle: GameTitle) {
  return getComponentBaseRoute(NavbarTool.SearchUGC, gameTitle);
}

/** Make user banning route. */
export function getUserBanningRoute(gameTitle: GameTitle) {
  return getComponentBaseRoute(NavbarTool.UserBanning, gameTitle);
}

/** Make user banning route. */
export function getForumBanningRoute() {
  return [`/app/tools/${NavbarTool.UserBanning}/forum`];
}

/** Make user group management route. */
export function getUserGroupManagementRoute(gameTitle: GameTitle) {
  return getComponentBaseRoute(NavbarTool.UserGroupManagement, gameTitle);
}

/** Make Ugc Details route. */
export function getUgcDetailsRoute(gameTitle: GameTitle, ugcId: string, ugcType?: UgcType) {
  return ['/app/tools/ugc-details/', gameTitle, ugcId, ugcType?.toLowerCase() ?? ''];
}

/** Make Messaging route. */
export function getMessagingRoute(gameTitle: GameTitle) {
  return getComponentBaseRoute(NavbarTool.Messaging, gameTitle);
}

/** Make message of the day route. */
export function getMessageOfTheDayRoute(gameTitle: GameTitle) {
  return getComponentBaseRoute(NavbarTool.MessageOfTheDay, gameTitle);
}

/** Make create auction route. */
export function getCreateAuctionRoute(gameTitle: GameTitle) {
  return getComponentBaseRoute(NavbarTool.CreateAuction, gameTitle);
}

/** Make welcome center tiles route. */
export function getWelcomeCenterTilesRoute(gameTitle: GameTitle) {
  return getComponentBaseRoute(NavbarTool.WelcomeCenterTiles, gameTitle);
}

/** Make auction details route. */
export function getAuctionDetailsRoute(gameTitle: GameTitle, auctionId: string) {
  return ['/app/tools/auction-details/', gameTitle, auctionId];
}

/** Make PlayFab route. */
export function getPlayFabRoute(gameTitle: GameTitle) {
  return ['/app/tools/playfab/', gameTitle];
}
