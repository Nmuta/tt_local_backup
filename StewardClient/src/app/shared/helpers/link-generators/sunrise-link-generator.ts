import { AuctionDetailsLinkGenerator } from './link-generator';

/** Generates various links for Sunrise routes. */
class SunriseLinkGenerator implements AuctionDetailsLinkGenerator {
  /** Generates a route from root to the Auction Details tool, given an Auction ID. */
  public makeAuctionDetailsRoute(auctionId: string): string[] {
    return ['', 'app', 'tools', 'auction-details', 'sunrise', auctionId];
  }
}

/** Generates various links for Sunrise routes. */
export const SUNRISE_LINK_GENERATOR = new SunriseLinkGenerator();
