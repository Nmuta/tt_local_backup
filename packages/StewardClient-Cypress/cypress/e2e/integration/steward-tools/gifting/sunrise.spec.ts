import { login } from '@support/steward/auth/login';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { goToTool } from './page';
import { selectSunrise } from '@support/steward/shared-functions/game-nav';
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
  verifyTooManyWheelSpinsTest,
  verifyTooManySuperWheelSpinsTest,
} from './shared-tests';

const defaultUser = RetailUsers['testing1'];

context('Steward / Tools / Gifting / Sunrise', () => {
  before(() => {
    login();
    disableFakeApi();
  });

  context('GTAG Lookup', () => {
    before(() => {
      goToTool();
      selectSunrise();
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
      selectSunrise();
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
      selectSunrise();
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
