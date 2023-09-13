import { goToTool } from './page';
import { selectWoodstock } from '@support/steward/shared-functions/game-nav';
import {
  verifyAuctionDeleteButtonUnlock,
  verifyAuctionInformation,
  verifyInvalidAuctionSearch,
} from './shared-tests';
import { resetToDefaultState } from '@support/page-utility/reset-to-default-state';

// The following is an auction ID belonging to the dev account chada AKA r2dubs
const validAuctionId = '91aed181-952c-48ed-a61a-ec4933a95902';

context('Steward / Tools / Auction Details / Woodstock', () => {
  before(() => {
    resetToDefaultState();
  });

  context('Auction Lookup', () => {
    beforeEach(() => {
      goToTool();
      selectWoodstock();
    });

    verifyAuctionInformation(validAuctionId);
    verifyInvalidAuctionSearch();
    verifyAuctionDeleteButtonUnlock(validAuctionId);
  });
});
