import { checkboxHasValue } from '@support/mat-form/checkbox-has-value';
import { tableHasEntry } from '@support/mat-form/table-has-entry';

/** Shared tests for Sunrise Player Details. */
export function playerDetailsSunriseSharedTests(): void {
  it('should have found data', () => {
    // found user
    cy.contains('.identifier', 'FuriKuriFan5').should('exist');
    cy.contains('.identifier', '2535435129485725').should('exist');

    // found flag data
    checkboxHasValue('Is Vip', true);
    checkboxHasValue('Is Community Manager', false);

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
