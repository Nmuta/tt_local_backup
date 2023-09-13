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
import { selectApollo } from '@support/steward/shared-functions/game-nav';
import { withTags, Tag } from '@support/tags';

// If changing these dates, be sure they are used in the correct order of first then last below
const noGiftsDateStart = '1/1/2023';
const noGiftsDateEnd = '1/2/2023';

// Ideally, there should be the exact same # of gifts between the two dates in both dev and prod
const userWithRecentGifts = RetailUsers['testing1'];
const recentGiftToUserInProd = '8/22/2023';
const recentGiftToUserInDev = '8/18/2023';
const numberOfExpectedUserGifts = 1;

const lspGroupWithRecentGifts = 'Live Ops Developers';
const recentGiftToLSPInProd = '8/22/2023'; // this value is for Live Ops Testing, details under LSP Group Lookup section
const recentGiftToLSPInDev = '8/18/2023'; // this value is for Live Ops Developers, details under LSP Group Lookup section
const numberOfExpectedLSPGifts = 1;

context('Steward / Tools / Gift History / Apollo', () => {
  before(() => {
    login();

    disableFakeApi();
    goToTool();
    selectApollo();
  });

  context('GTAG Lookup', () => {
    verifySearchInvalidGtagEmptyHistoryTest();
    verifySearchValidGtagGiftsExistsTest(userWithRecentGifts.gtag);
  });

  context('XUID Lookup', () => {
    verifySearchInvalidXuidEmptyHistoryTest();
    verifySearchValidXuidGiftsExistsTest(userWithRecentGifts.xuid);
    verifyGiftHistoryCalendarWhereGiftsExist(
      userWithRecentGifts.xuid,
      recentGiftToUserInDev,
      recentGiftToUserInProd,
      numberOfExpectedUserGifts,
    );
    verifyGiftHistoryCalendarWhereGiftsDoNotExist(
      userWithRecentGifts.xuid,
      noGiftsDateStart,
      noGiftsDateEnd,
    );
  });

  context('LSP Group Lookup', withTags(Tag.Broken), () => {
    // Apollo doesn't have any gifts for Live Ops Developers in prod, so Live Ops Testing was used
    // To solve this to work in dev and prod, send gifts to Live Ops Developers in prod or Live Ops testing in dev
    verifySearchValidLspGroupHistoryGiftsExistsTest(lspGroupWithRecentGifts);
    verifySearchValidLspGroupHistoryGiftsExistsCalendarTest(
      lspGroupWithRecentGifts,
      recentGiftToLSPInDev,
      recentGiftToLSPInProd,
      numberOfExpectedLSPGifts,
    );
  });
});
