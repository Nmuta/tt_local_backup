import env from '@support/env';
import { login } from '@support/steward/auth/login';
import { AccountInfo, RetailUsers } from '@support/steward/common/account-info';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { searchByGtag, searchByXuid } from '@support/steward/shared-functions/searching';
import { stewardUrls } from '@support/steward/urls';
import { Tag, withTags } from '@support/tags';

context('Steward / Tools / Player Details', withTags(Tag.UnitTestStyle), () => {
  beforeEach(() => {
    login();

    disableFakeApi();
  });

  context('GTAG Lookup', () => {
    beforeEach(() => {
      cy.visit(stewardUrls.tools.playerDetails.default);
      searchByGtag(RetailUsers['jordan'].gtag);
    });

    displaysCorrectActiveTitles(RetailUsers['jordan'].accountInfo);
  });

  context('XUID Lookup', () => {
    beforeEach(() => {
      cy.visit(stewardUrls.tools.playerDetails.default);
      searchByXuid(RetailUsers['jordan'].xuid);
    });

    displaysCorrectActiveTitles(RetailUsers['jordan'].accountInfo);
  });
});

/** Tests that verify that the correct accounts are displayed after a lookup. */
function displaysCorrectActiveTitles(allExpected: AccountInfo[]): void {
  it('should display correct accounts', () => {
    for (const expected of allExpected) {
      // skip if our environment does not support this title yet
      if (!env.testTitle[expected.title.toLowerCase()]) {
        continue;
      }

      const $element = cy.contains('a', expected.title);
      if (expected.hasAccount) {
        // account should exist
        $element.should('not.have.class', 'mat-button-disabled');
      } else {
        // account should not exist
        $element.should('have.class', 'mat-button-disabled');
      }
    }
  });
}
