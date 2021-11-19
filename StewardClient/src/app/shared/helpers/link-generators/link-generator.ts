/** Allows generating various Auction Details links. */
export interface AuctionDetailsLinkGenerator {
  /** Generates a route from root to the Auction Details tool, given an Auction ID. */
  makeAuctionDetailsRoute(auctionId: string): string[];
}
