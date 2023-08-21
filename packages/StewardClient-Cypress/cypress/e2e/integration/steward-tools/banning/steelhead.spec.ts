import { stewardUrls } from '../../../../support/steward/urls';
import { resetToDefaultState } from '@support/page-utility/reset-to-default-state';
import { RetailUsers } from '@support/steward/common/account-info';
import {
  testClearAll,
  testFillOutBan,
  testFillOutBanCustomReason,
  testHelpCard,
  testInvalidBanConditions,
} from './shared-functions';
import { searchByGtag, searchByXuid } from '@support/steward/shared-functions/searching';

const steelheadUser = RetailUsers['madden'];

context('Steward / Tools / Banning / Steelhead', () => {
  before(() => {
    resetToDefaultState();
    cy.visit(stewardUrls.tools.banning.steelhead);
  });

  context('GTAG Lookup', () => {
    before(() => {
      cy.visit(stewardUrls.tools.banning.steelhead);
      searchByGtag(steelheadUser.gtag);
    });
    context('With default user', () => {
      // No users currently have ban history in Steelhead
      //testVerifySearchForUser('All Requests');
      testFillOutBan('Testing', 'Steelhead');
      testFillOutBanCustomReason();
      testInvalidBanConditions();
    });
  });

  context('XUID Lookup', () => {
    before(() => {
      cy.visit(stewardUrls.tools.banning.woodstock);
      searchByXuid(steelheadUser.xuid);
    });
    context('With default user', () => {
      // No users currently have ban history in Steelhead
      //testVerifySearchForUser('All Requests');
      testFillOutBan('Testing', 'Steelhead');
      testFillOutBanCustomReason();
      testInvalidBanConditions();
    });
  });

  context('Common Tests', () => {
    testClearAll('All Requests');
    testHelpCard();
  });
});
