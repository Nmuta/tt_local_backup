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

const woodstockUser = RetailUsers['luke'];

context('Steward / Tools / Banning / Woodstock', () => {
  before(() => {
    resetToDefaultState();
    cy.visit(stewardUrls.tools.banning.woodstock);
  });

  context('GTAG Lookup', () => {
    before(() => {
      cy.visit(stewardUrls.tools.banning.woodstock);
      searchByGtag(woodstockUser.gtag);
    });
    context('With default user', () => {
      testVerifySearchForUser('All Requests');
      testFillOutBan('Testing', 'Woodstock');
      testFillOutBanCustomReason();
      testInvalidBanConditions();
    });
  });

  context('XUID Lookup', () => {
    before(() => {
      cy.visit(stewardUrls.tools.banning.woodstock);
      searchByXuid(woodstockUser.xuid);
    });
    context('With default user', () => {
      testVerifySearchForUser('All Requests');
      testFillOutBan('Testing', 'Woodstock');
      testFillOutBanCustomReason();
      testInvalidBanConditions();
    });
  });

  context('Common Tests', () => {
    testClearAll('All Requests');
    testHelpCard();
  });
});
