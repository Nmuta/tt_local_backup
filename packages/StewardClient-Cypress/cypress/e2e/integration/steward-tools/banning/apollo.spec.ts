import { stewardUrls } from '../../../../support/steward/urls';
import { resetToDefaultState } from '@support/page-utility/reset-to-default-state';
import { RetailUsers } from '@support/steward/common/account-info';
import {
  testClearAll,
  testFillOutBan,
  testFillOutBanCustomReason,
  testHelpCard,
  testInvalidBanConditions,
  testVerifySearchForUser,
} from './shared-functions';
import { searchByGtag, searchByXuid } from '@support/steward/shared-functions/searching';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';

const apolloUser = RetailUsers['luke'];

context('Steward / Tools / Banning / Apollo', () => {
  before(() => {
    resetToDefaultState();
    cy.visit(stewardUrls.tools.banning.apollo);
  });

  context('GTAG Lookup', () => {
    before(() => {
      cy.visit(stewardUrls.tools.banning.apollo);
      searchByGtag(apolloUser.gtag);
      waitForProgressSpinners();
    });
    context('With default user', () => {
      testVerifySearchForUser('All Requests');
      testFillOutBan('Testing', 'Apollo');
      testFillOutBanCustomReason();
      testInvalidBanConditions();
    });
  });

  context('XUID Lookup', () => {
    before(() => {
      cy.visit(stewardUrls.tools.banning.apollo);
      searchByXuid(apolloUser.xuid);
      waitForProgressSpinners();
    });
    context('With default user', () => {
      testVerifySearchForUser('All Requests');
      testFillOutBan('Testing', 'Apollo');
      testFillOutBanCustomReason();
      testInvalidBanConditions();
    });
  });

  context('Common Tests', () => {
    testClearAll('All Requests');
    testHelpCard();
  });
});
