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
import { selectSunrise } from '@support/steward/shared-functions/game-nav';

// If changing any dates, be sure they are used in the correct order of first then last below
const noGiftsDateStart = '1/1/2023';
const noGiftsDateEnd = '1/2/2023';

// Ideally, there should be the exact same number of gifts between the two dates in both dev and prod
const userWithRecentGifts = RetailUsers['testing1'];
const recentGiftToUserInProd = '12/22/2022';
const recentGiftToUserInDev = '8/19/2023';
const numberOfExpectedUserGifts = 1;

const lspGroupWithRecentGifts = 'Live Ops Developers';
const recentGiftToLSPInProd = '3/16/2022';
const recentGiftToLSPInDev = '8/19/2023';
const numberOfExpectedLSPGifts = 1;

context('Steward / Tools / Gift History / Sunrise', () => {
  before(() => {
    login();

    disableFakeApi();
    goToTool();
    selectSunrise();
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
    verifySearchValidLspGroupHistoryGiftsExistsTest(lspGroupWithRecentGifts);
    verifySearchValidLspGroupHistoryGiftsExistsCalendarTest(
      lspGroupWithRecentGifts,
      recentGiftToLSPInProd,
      recentGiftToLSPInDev,
      numberOfExpectedLSPGifts,
    );
  });
});
