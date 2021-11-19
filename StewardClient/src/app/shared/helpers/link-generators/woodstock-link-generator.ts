import { AuctionDetailsLinkGenerator } from './link-generator';

/** Generates various links for Woodstock routes. */
class WoodstockLinkGenerator implements AuctionDetailsLinkGenerator {
  /** Generates a route from root to the Auction Details tool, given an Auction ID. */
  public makeAuctionDetailsRoute(auctionId: string): string[] {
    return ['', 'app', 'tools', 'auction-details', 'woodstock', auctionId];
  }
}

/** Generates various links for Woodstock routes. */
export const WOODSTOCK_LINK_GENERATOR = new WoodstockLinkGenerator();
