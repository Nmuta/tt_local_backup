import { login } from '@support/steward/auth/login';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { goToTool } from './page';
import { selectWoodstock } from '@support/steward/shared-functions/game-nav';
import {
  searchByGtag,
  searchByXuid,
  selectLspGroup,
} from '@support/steward/shared-functions/searching';
import { verifyChip } from '@support/steward/shared-functions/verify-chip';
import { RetailUsers } from '@support/steward/common/account-info';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import {
  verifyNoInputsTest,
  verifyNoGiftReasonTest,
  verifyValidGiftTest,
  verifyTooManyCreditsTest,
  verifyTooManySuperWheelSpinsTest,
  verifyTooManyWheelSpinsTest,
} from './shared-tests';
import { cleanUpTestAccounts } from '@support/steward/common/clear-up-test-accounts';

const defaultUser = RetailUsers['testing1'];

context('Steward / Tools / Gifting / Woodstock', () => {
  before(() => {
    login();
    disableFakeApi();
    cleanUpTestAccounts();
  });

  after(() => {
    cleanUpTestAccounts();
  });

  context('GTAG Lookup', () => {
    before(() => {
      goToTool();
      selectWoodstock();
      searchByGtag(defaultUser.gtag);
      waitForProgressSpinners();
    });

    verifyChip(defaultUser.gtag);
    verifyNoInputsTest();
    verifyNoGiftReasonTest();
    verifyTooManyCreditsTest();
    verifyTooManyWheelSpinsTest();
    verifyTooManySuperWheelSpinsTest();
    verifyValidGiftTest();
  });

  context('XUID Lookup', () => {
    before(() => {
      goToTool();
      selectWoodstock();
      searchByXuid(defaultUser.xuid);
      waitForProgressSpinners();
    });

    verifyChip(defaultUser.xuid);
    verifyNoInputsTest();
    verifyNoGiftReasonTest();
    verifyTooManyCreditsTest();
    verifyTooManyWheelSpinsTest();
    verifyTooManySuperWheelSpinsTest();
    verifyValidGiftTest();
  });

  context('GroupId Lookup', () => {
    before(() => {
      goToTool();
      selectWoodstock();
      selectLspGroup('Live Ops Developers');
    });

    verifyNoInputsTest();
    verifyNoGiftReasonTest();
    verifyTooManyCreditsTest();
    verifyTooManyWheelSpinsTest();
    verifyTooManySuperWheelSpinsTest();
    verifyValidGiftTest();
  });
});
