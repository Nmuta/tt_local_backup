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

const forumUser = RetailUsers['madden'];

context('Steward / Tools / Banning / Forum', () => {
  before(() => {
    resetToDefaultState();
    cy.visit(stewardUrls.tools.banning.forum);
  });

  context('GTAG Lookup', () => {
    before(() => {
      cy.visit(stewardUrls.tools.banning.forum);
      searchByGtag(forumUser.gtag);
    });
    context('With default user', () => {
      testVerifySearchForUser('Forum');
      testFillOutBan('Personal Attacks', 'Forum');
      testFillOutBanCustomReason();
      testInvalidBanConditions();
    });
  });

  context('XUID Lookup', () => {
    before(() => {
      cy.visit(stewardUrls.tools.banning.forum);
      searchByXuid(forumUser.xuid);
    });
    context('With default user', () => {
      testVerifySearchForUser('Forum');
      testFillOutBan('Personal Attacks', 'Forum');
      testFillOutBanCustomReason();
      testInvalidBanConditions();
    });
  });

  context('Common Tests', () => {
    testClearAll('Forum');
    testHelpCard();
  });
});
