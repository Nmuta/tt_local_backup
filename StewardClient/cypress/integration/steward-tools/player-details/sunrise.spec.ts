import { checkboxHasValue } from '@support/mat-form/checkbox-has-value';
import { tableHasEntry } from '@support/mat-form/table-has-entry';
import { verifyPlayerIdentityResults } from '@support/steward/component/player-identity-results';
import { login } from '@support/steward/auth/login';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { searchByGtag, searchByXuid, selectSunrise } from './page';
import { jordan } from '@support/steward/common/account-info';

context('Steward / Tools / Player Details / Sunrise', () => {
  beforeEach(() => {
    login();

    disableFakeApi();
  });

  context('GTAG Lookup', () => {
    beforeEach(() => {
      searchByGtag(jordan.gtag);
      selectSunrise();
    });

    foundUserDataTest();
  });

  context('XUID Lookup', () => {
    beforeEach(() => {
      searchByXuid(jordan.xuid);
      selectSunrise();
    });

    foundUserDataTest();
  });
});

function foundUserDataTest(): void {
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

    // found profile notes
    cy.contains('mat-card', 'Profile Notes').within(() => {
      tableHasEntry('text', 'This is a testing string, not a chicken wing.');
    });

    // found related gamertags
    cy.contains('mat-card', 'Related Gamertags').within(() => {
      tableHasEntry('xuid', '2535435129485725');
    });

    // found related consoles
    cy.contains('mat-card', 'Consoles').within(() => {
      tableHasEntry('consoleId', '18230637609444823812');
    });

    //// switch to Deep Dive ////
    cy.contains('.mat-tab-label', 'Deep Dive').click();

    // found overview data
    cy.contains('mat-card', 'Overview').within(() => {
      cy.contains('th', 'Current Credits').should('exist');
    });

    // found credit history
    cy.contains('mat-card', 'Credit History').within(() => {
      tableHasEntry('deviceType', 'UWP');
    });

    //// switch to Inventory ////
    cy.contains('.mat-tab-label', 'Inventory').click();

    // found player inventory data
    cy.contains('mat-card', 'Player Inventory').within(() => {
      cy.contains('Credit Rewards');
    });

    //// switch to Notifications ////
    cy.contains('.mat-tab-label', 'Notifications').click();

    // found player inventory data
    cy.contains('mat-card', 'Notifications').within(() => {
      cy.contains('Xls. Notifications. Unbanned Notification');
    });
  });
}
