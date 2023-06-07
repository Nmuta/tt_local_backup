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
    verifyGiftHistoryCalendarWhereGiftsExist(jordan.xuid, '12/22/2022', '5/30/2023', 1);
    verifyGiftHistoryCalendarWhereGiftsDoNotExist(jordan.xuid, '1/1/2023', '1/2/2023');
  });

  context('LSP Group Lookup', () => {
    beforeEach(() => {
      goToTool();
      selectSunrise();
    });
    verifySearchValidLspGroupHistoryGiftsExistsTest('Live Ops Developers');
    verifySearchValidLspGroupHistoryGiftsExistsCalendarTest(
      'Live Ops Developers',
      '3/16/2022',
      '6/1/2023',
      1,
    );
  });
});
