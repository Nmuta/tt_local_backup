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
    verifyGiftHistoryCalendarWhereGiftsExist(jordan.xuid, '12/22/2022', '5/30/2023', 1);
    verifyGiftHistoryCalendarWhereGiftsDoNotExist(jordan.xuid, '1/1/2023', '1/2/2023');
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
      '3/16/2022',
      '6/1/2023',
      1,
    );
  });
});
