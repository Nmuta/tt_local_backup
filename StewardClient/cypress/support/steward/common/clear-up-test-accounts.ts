import { stewardUrls } from '../urls';
import { AllKnownUsers } from './account-info';
import { waitForProgressSpinners } from './wait-for-progress-spinners';

/** Waits for progress spinners to be absent from the page. */
export function cleanUpTestAccounts(): void {
  cy.visit(stewardUrls.tools.home);
  cy.contains('mat-icon', 'account_circle').click();
  cy.wait(100); // Wait for sidebar animation

  AllKnownUsers.forEach(user => {
    cy.contains('mat-card-title', 'Dev Tools').should('exist');
    cy.contains('mat-form-field', 'Player Xuid').click().type(user.xuid);
    cy.contains('button', 'Delete Player Notifications').click();
    waitForProgressSpinners(20_000);
  });
}
