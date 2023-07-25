import { stewardUrls } from '../../../../support/steward/urls';
import { resetToDefaultState } from '@support/page-utility/reset-to-default-state';
import { RetailUsers } from '@support/steward/common/account-info';
import {
  testClearAll,
  testFillOutBan,
  testFillOutBanCustomReason,
  testHelpCard,
  testInvalidBanConditions,
  testSearchForUserByGtag,
  testSearchForUserByXuid,
} from './shared-functions';

const forumUser = RetailUsers['madden'];

context('Steward / Tools / Banning / Forum', () => {
  before(() => {
    resetToDefaultState();
    cy.visit(stewardUrls.tools.banning.forum);
  });

  context('GTAG Lookup', () => {
    before(() => {
      cy.visit(stewardUrls.tools.banning.forum);
    });
    context('With default user', () => {
      testSearchForUserByGtag(forumUser, 'Forum');
      testFillOutBan();
      testFillOutBanCustomReason();
      testInvalidBanConditions();
    });
  });

  context('XUID Lookup', () => {
    before(() => {
      cy.visit(stewardUrls.tools.banning.forum);
    });
    context('With default user', () => {
      testSearchForUserByXuid(forumUser, 'Forum');
      testFillOutBan();
      testFillOutBanCustomReason();
      testInvalidBanConditions();
    });
  });

  context('Common Tests', () => {
    testClearAll('Forum');
    testHelpCard();
  });
});
