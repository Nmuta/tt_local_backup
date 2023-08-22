import { login } from '@support/steward/auth/login';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { goToTool } from './page';
import { selectWoodstock } from '@support/steward/shared-functions/game-nav';
import {
  verifyAuctionDeleteButtonUnlock,
  verifyAuctionInformation,
  verifyInvalidAuctionSearch,
} from './shared-tests';
import { withTags, Tag } from '@support/tags';

// The following is an auction ID belonging to the dev account chada AKA r2dubs
const validAuctionId = '91aed181-952c-48ed-a61a-ec4933a95902';

context('Steward / Tools / Auction Details / Woodstock', withTags(Tag.UnitTestStyle), () => {
  beforeEach(() => {
    login();
    disableFakeApi();
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
