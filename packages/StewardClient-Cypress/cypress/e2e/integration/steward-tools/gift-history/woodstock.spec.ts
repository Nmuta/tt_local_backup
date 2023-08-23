import { login } from '@support/steward/auth/login';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { goToTool } from './page';
import { RetailUsers } from '@support/steward/common/account-info';
import {
  verifySearchInvalidGtagEmptyHistoryTest,
  verifySearchValidGtagGiftsExistsTest,
  verifySearchInvalidXuidEmptyHistoryTest,
  verifySearchValidXuidGiftsExistsTest,
  verifyGiftHistoryCalendarWhereGiftsExist,
  verifyGiftHistoryCalendarWhereGiftsDoNotExist,
  verifySearchValidLspGroupHistoryGiftsExistsCalendarTest,
  verifySearchValidLspGroupHistoryGiftsExistsTest,
} from './shared-tests';
import { selectWoodstock } from '@support/steward/shared-functions/game-nav';
import { Tag, withTags } from '@support/tags';

// If changing these dates, be sure they are used in the correct order of first then last below
const noGiftsDateStart = '1/1/2023';
const noGiftsDateEnd = '1/2/2023';

// Ideally, there should be the exact same number of gifts between the two dates in both dev and prod
const userWithRecentGifts = RetailUsers['jordan'];
const recentGiftToUserInProd = '2/7/2023';
const recentGiftToUserInDev = '5/30/2023';
const numberOfExpectedUserGifts = 1;

const lspGroupWithRecentGifts = 'Live Ops Developers';
const recentGiftToLSPInProd = '9/21/2022';
const recentGiftToLSPInDev = '6/1/2023';
const numberOfExpectedLSPGifts = 2; // inconsistency here, check LSP Group Lookup for details

context('Steward / Tools / Gift History / Woodstock', withTags(Tag.UnitTestStyle), () => {
  beforeEach(() => {
    login();

    disableFakeApi();
  });

  context('GTAG Lookup', () => {
    beforeEach(() => {
      goToTool();
      selectWoodstock();
    });
    verifySearchInvalidGtagEmptyHistoryTest();
    verifySearchValidGtagGiftsExistsTest(userWithRecentGifts.gtag);
  });

  context('XUID Lookup', () => {
    beforeEach(() => {
      goToTool();
      selectWoodstock();
    });
    verifySearchInvalidXuidEmptyHistoryTest();
    verifySearchValidXuidGiftsExistsTest(userWithRecentGifts.xuid);
    verifyGiftHistoryCalendarWhereGiftsExist(
      userWithRecentGifts.xuid,
      recentGiftToUserInProd,
      recentGiftToUserInDev,
      numberOfExpectedUserGifts,
    );
    verifyGiftHistoryCalendarWhereGiftsDoNotExist(
      userWithRecentGifts.xuid,
      noGiftsDateStart,
      noGiftsDateEnd,
    );
  });

  context('LSP Group Lookup', () => {
    beforeEach(() => {
      goToTool();
      selectWoodstock();
    });
    verifySearchValidLspGroupHistoryGiftsExistsTest(lspGroupWithRecentGifts);

    context('Broken', withTags(Tag.Broken), () => {
      // Currently, the most recent gifts in prod woodstock are 2 gifts on 9/21/2022
      // We can change the way this works if desired, but as of now this will work for prod but not dev
      // If we get a more recent sunrise gift or another gift into prod, this can work for both
      verifySearchValidLspGroupHistoryGiftsExistsCalendarTest(
        lspGroupWithRecentGifts,
        recentGiftToLSPInProd,
        recentGiftToLSPInDev,
        numberOfExpectedLSPGifts,
      );
    });
  });
});
