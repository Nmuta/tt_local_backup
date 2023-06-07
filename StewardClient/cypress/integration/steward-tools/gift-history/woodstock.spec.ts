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
import { selectWoodstock } from '@support/steward/shared-functions/game-nav';

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
    verifyGiftHistoryCalendarWhereGiftsExist(jordan.xuid, '2/7/2023', '5/30/2023', 1);
    verifyGiftHistoryCalendarWhereGiftsDoNotExist(jordan.xuid, '1/1/2023', '1/2/2023');
  });

  context('LSP Group Lookup', () => {
    beforeEach(() => {
      goToTool();
      selectWoodstock();
    });
    verifySearchValidLspGroupHistoryGiftsExistsTest('Live Ops Developers');
    // Currently, the most recent gifts in prod woodstock are 2 gifts on 9/21/2022
    // We can change the way this works if desired, but as of now this will work for prod but not dev
    // If we get a more recent sunrise gift or another gift into prod, this can work for both
    verifySearchValidLspGroupHistoryGiftsExistsCalendarTest(
      'Live Ops Developers',
      '9/21/2022',
      '6/1/2023',
      2,
    );
  });
});
