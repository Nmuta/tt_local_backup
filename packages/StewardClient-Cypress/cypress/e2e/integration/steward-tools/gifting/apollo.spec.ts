import { login } from '@support/steward/auth/login';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { goToTool } from './page';
import { selectApollo } from '@support/steward/shared-functions/game-nav';
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
} from './shared-tests';

context('Steward / Tools / Gifting / Apollo', () => {
  before(() => {
    login();
    disableFakeApi();
    goToTool();
    selectApollo();
    searchByGtag(RetailUsers['testing1'].gtag);
    waitForProgressSpinners();
  });

  context('GTAG Lookup', () => {
    verifyChip(RetailUsers['testing1'].gtag);
    verifyNoInputsTest();
    verifyNoGiftReasonTest();
    verifyTooManyCreditsTest();
    verifyValidGiftTest();
  });

  context('XUID Lookup', () => {
    before(() => {
      goToTool();
      selectApollo();
      searchByXuid(RetailUsers['testing1'].xuid);
    });
    verifyChip(RetailUsers['testing1'].xuid);
    verifyNoInputsTest();
    verifyNoGiftReasonTest();
    verifyTooManyCreditsTest();
    verifyValidGiftTest();
  });

  context('GroupId Lookup', () => {
    before(() => {
      goToTool();
      selectApollo();
      selectLspGroup('Live Ops Developers');
    });
    verifyNoInputsTest();
    verifyNoGiftReasonTest();
    verifyTooManyCreditsTest();
    verifyValidGiftTest();
  });
});
