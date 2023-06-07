import { login } from '@support/steward/auth/login';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { goToTool } from './page';
import { jordan } from '@support/steward/common/account-info';
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

// If changing these dates, be sure they are used in the correct order of first then last below
const noGiftsDateStart = '1/1/2023';
const noGiftsDateEnd = '1/2/2023';
const recentGiftToUserInProd = '12/22/2022';
const recentGiftToUserInDev = '5/30/2023';
const numberOfExpectedUserGifts = 1;
// Ideally, there should be the exact same # of gifts between the two dates in both dev and prod
const recentGiftToLSPInProd = '3/16/2022'; // this value is for Live Ops Testing, details under LSP Group Lookup section
const recentGiftToLSPInDev = '6/1/2023'; // this value is for Live Ops Developers, details under LSP Group Lookup section
const numberOfExpectedLSPGifts = 1;

context('Steward / Tools / Gift History / Apollo', () => {
  beforeEach(() => {
    login();

    disableFakeApi();
  });

  context('GTAG Lookup', () => {
    beforeEach(() => {
      goToTool();
      selectApollo();
    });
    verifySearchInvalidGtagEmptyHistoryTest();
    verifySearchValidGtagGiftsExistsTest(jordan.gtag);
  });

  context('XUID Lookup', () => {
    beforeEach(() => {
      goToTool();
      selectApollo();
    });
    verifySearchInvalidXuidEmptyHistoryTest();
    verifySearchValidXuidGiftsExistsTest(jordan.xuid);
    verifyGiftHistoryCalendarWhereGiftsExist(
      jordan.xuid,
      recentGiftToUserInProd,
      recentGiftToUserInDev,
      numberOfExpectedUserGifts,
    );
    verifyGiftHistoryCalendarWhereGiftsDoNotExist(jordan.xuid, noGiftsDateStart, noGiftsDateEnd);
  });

  context('LSP Group Lookup', () => {
    beforeEach(() => {
      goToTool();
      selectApollo();
    });
    // Apollo doesn't have any gifts for Live Ops Developers in prod, so Live Ops Testing was used
    // To solve this to work in dev and prod, send gifts to Live Ops Developers in prod or Live Ops testing in dev
    verifySearchValidLspGroupHistoryGiftsExistsTest('Live Ops Testing');
    verifySearchValidLspGroupHistoryGiftsExistsCalendarTest(
      'Live Ops Testing',
      recentGiftToLSPInProd,
      recentGiftToLSPInDev,
      numberOfExpectedLSPGifts,
    );
  });
});
