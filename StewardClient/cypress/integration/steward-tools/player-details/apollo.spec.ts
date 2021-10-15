import { checkboxHasValue } from '@support/mat-form/checkbox-has-value';
import { tableHasEntry } from '@support/mat-form/table-has-entry';
import { login } from '@support/steward/auth/login';
import { jordan } from '@support/steward/common/account-info';
import { verifyPlayerIdentityResults } from '@support/steward/component/player-identity-results';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { searchByGtag, searchByXuid, selectApollo } from './page';

context('Steward / Tools / Player Details / Apollo', () => {
  beforeEach(() => {
    login();
    disableFakeApi();
  });

  context('GTAG Lookup', () => {
    beforeEach(() => {
      searchByGtag(jordan.gtag);
      selectApollo();
    });

    foundUserData();
  });

  context('XUID Lookup', () => {
    beforeEach(() => {
      searchByXuid(jordan.xuid);
      selectApollo();
    });

    foundUserData();
  });
});

function foundUserData(): void {
  it('should have found data', () => {
    // found user
    verifyPlayerIdentityResults({ gtag: jordan.gtag, xuid: jordan.xuid, t10Id: false });

    // found flag data
    checkboxHasValue('Is Vip', true);
    checkboxHasValue('Is Under Review', false);

    // found bans
    cy.contains('mat-card', 'Ban History').within(() => {
      tableHasEntry('featureArea', 'All Requests');
    });

    // found related gamertags
    cy.contains('mat-card', 'Related Gamertags').within(() => {
      tableHasEntry('xuid', '2535435129485725');
    });

    // found related consoles
    cy.contains('mat-card', 'Consoles').within(() => {
      tableHasEntry('consoleId', '18230637609444823812');
    });

    //// switch to Inventory ////
    cy.contains('.mat-tab-label', 'Inventory').click();

    // found player inventory data
    cy.contains('mat-card', 'Player Inventory').within(() => {
      cy.contains('Credit Rewards');
    });
  });
}
