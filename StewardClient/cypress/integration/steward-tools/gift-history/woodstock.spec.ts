import { login } from '@support/steward/auth/login';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { selectWoodstock, goToTool } from './page';
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

context('Steward / Tools / Gift History / Woodstock', () => {
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
    verifySearchValidGtagGiftsExistsTest(jordan.gtag);
  });

  context('XUID Lookup', () => {
    beforeEach(() => {
      goToTool();
      selectWoodstock();
    });
    verifySearchInvalidXuidEmptyHistoryTest();
    verifySearchValidXuidGiftsExistsTest(jordan.xuid);
    verifyGiftHistoryCalendarWhereGiftsExist(jordan.xuid, '2/7/2023', '5/30/2023');
    verifyGiftHistoryCalendarWhereGiftsDoNotExist(jordan.xuid, '1/1/2023', '1/2/2023');
  });

  context('LSP Group Lookup', () => {
    beforeEach(() => {
      goToTool();
      selectWoodstock();
    });
    verifySearchValidLspGroupHistoryGiftsExistsTest('Live Ops Developers');
    verifySearchValidLspGroupHistoryGiftsExistsCalendarTest(
      'Live Ops Developers',
      '9/21/2022',
      '5/30/2023',
    );
  });
});
