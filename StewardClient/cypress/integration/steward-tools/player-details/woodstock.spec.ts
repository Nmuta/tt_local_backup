import { checkboxHasValue } from '@support/mat-form/checkbox-has-value';
import { tableHasEntry } from '@support/mat-form/table-has-entry';
import { verifyPlayerIdentityResults } from '@support/steward/component/player-identity-results';
import { login } from '@support/steward/auth/login';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { searchByGtag, searchByXuid } from '@support/steward/shared-functions/searching';
import { selectWoodstock } from '@support/steward/shared-functions/game-nav';
import { stewardUrls } from '@support/steward/urls';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import { RetailUsers } from '@support/steward/common/account-info';

context('Steward / Tools / Player Details / Woodstock', () => {
  beforeEach(() => {
    login();

    disableFakeApi();
  });

  context('GTAG Lookup', () => {
    beforeEach(() => {
      cy.visit(stewardUrls.tools.playerDetails.default);
      searchByGtag(RetailUsers['luke'].gtag);
      selectWoodstock();
    });

    foundUserDataTest();
  });

  context('XUID Lookup', () => {
    beforeEach(() => {
      cy.visit(stewardUrls.tools.playerDetails.default);
      searchByXuid(RetailUsers['luke'].xuid);
      selectWoodstock();
    });

    foundUserDataTest();
  });
});

function foundUserDataTest(): void {
  it('should have found data', () => {
    // found user
    verifyPlayerIdentityResults({
      gtag: RetailUsers['luke'].gtag,
      xuid: RetailUsers['luke'].xuid,
      t10Id: false,
    });

    // found flag data
    checkboxHasValue('Is Vip', true);

    // found bans
    cy.contains('mat-card', 'Ban History').within(() => {
      tableHasEntry('banDetails', 'All Requests');
    });

    // found profile notes
    cy.contains('mat-card', 'Profile Notes').within(() => {
      tableHasEntry('text', 'test note from Steward API');
    });

    // found related gamertags
    cy.contains('mat-card', 'Related Gamertags').within(() => {
      //This specific component takes a very long time to run; so if it fails, it's likely the timeout on the spinner will just need to be increased to pass the test
      waitForProgressSpinners();
      tableHasEntry('xuid', '2535424453525895');
    });

    // found related consoles
    cy.contains('mat-card', 'Consoles').within(() => {
      tableHasEntry('consoleId', '18230640064596068933');
    });

    //// switch to Deep Dive ////
    cy.contains('.mat-tab-label', 'Deep Dive').click();

    // found overview data
    cy.contains('mat-card', 'Overview').within(() => {
      cy.contains('th', 'Current Credits').should('exist');
    });

    // found credit history
    cy.contains('mat-card', 'Credit History').within(() => {
      tableHasEntry('deviceType', 'Scorpio');
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
      cy.contains('Notifications');
    });
  });
}
