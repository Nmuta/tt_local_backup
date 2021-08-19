import env from '@support/env';
import { login } from '@support/steward/auth/login';
import { AccountInfo, jordan } from '@support/steward/common/account-info';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { searchByGtag, searchByT10Id, searchByXuid } from './page';

context('Steward / Support / Player Details', () => {
  beforeEach(() => {
    login();
    disableFakeApi();
  });

  context('GTAG Lookup', () => {
    beforeEach(() => {
      searchByGtag(jordan.gtag);
    });

    displaysCorrectActiveTitles(jordan.accountInfo);
  });

  context('XUID Lookup', () => {
    beforeEach(() => {
      searchByXuid(jordan.xuid);
    });

    displaysCorrectActiveTitles(jordan.accountInfo);
  });

  context('T10ID Lookup', () => {
    beforeEach(() => {
      searchByT10Id(jordan.t10Id);
    });

    displaysCorrectActiveTitles(jordan.accountInfo);
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
