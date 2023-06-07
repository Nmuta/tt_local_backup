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
import { selectSunrise } from '@support/steward/shared-functions/game-nav';

// If changing any dates, be sure they are used in the correct order of first then last below
const noGiftsDateStart = '1/1/2023';
const noGiftsDateEnd = '1/2/2023';
// Ideally, there should be the exact same number of gifts between the two dates in both dev and prod
const recentGiftToUserInProd = '12/22/2022';
const recentGiftToUserInDev = '5/30/2023';
const numberOfExpectedUserGifts = 1;
const recentGiftToLSPInProd = '3/16/2022';
const recentGiftToLSPInDev = '6/1/2023';
const numberOfExpectedLSPGifts = 1;

context('Steward / Tools / Gift History / Sunrise', () => {
  beforeEach(() => {
    login();

    disableFakeApi();
  });

  context('GTAG Lookup', () => {
    beforeEach(() => {
      goToTool();
      selectSunrise();
    });
    verifySearchInvalidGtagEmptyHistoryTest();
    verifySearchValidGtagGiftsExistsTest(jordan.gtag);
  });

  context('XUID Lookup', () => {
    beforeEach(() => {
      goToTool();
      selectSunrise();
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
      selectSunrise();
    });
    verifySearchValidLspGroupHistoryGiftsExistsTest('Live Ops Developers');
    verifySearchValidLspGroupHistoryGiftsExistsCalendarTest(
      'Live Ops Developers',
      recentGiftToLSPInProd,
      recentGiftToLSPInDev,
      numberOfExpectedLSPGifts,
    );
  });
});
