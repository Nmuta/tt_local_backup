import { login } from '@support/steward/auth/login';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { goToTool } from './page';
import { selectSunrise } from '@support/steward/shared-functions/game-nav';
import { verifyAuctionInformation, verifyInvalidAuctionSearch } from './shared-tests';

// The following is an auction ID belonging to the dev account chada AKA r2dubs
// TODO: Bug should perhaps be filed if necessary, as this same ID works in both sunrise and woodstock but likely originates from woodstock.
const validAuctionId = '91aed181-952c-48ed-a61a-ec4933a95902';

context('Steward / Tools / Auction Details / Sunrise', () => {
  beforeEach(() => {
    login();
    disableFakeApi();
  });

  context('Auction Lookup', () => {
    beforeEach(() => {
      goToTool();
      selectSunrise();
    });

    //TODO: No test account has interacted with the auctions in Sunrise on the prod server. 07/10
    //This test still ostensibly works, but may not be intended behavior.
    verifyAuctionInformation(validAuctionId);
    verifyInvalidAuctionSearch();

    //TODO: currently Sunrise seems to have no delete button for liveries. 07/10
    //verifyAuctionDeleteButtonUnlock(validAuctionId);
  });
});
