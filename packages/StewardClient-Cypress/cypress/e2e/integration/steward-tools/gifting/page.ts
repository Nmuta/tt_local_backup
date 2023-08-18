import { clickIfExists } from '@support/cypress/click-if-exists';
import { stewardUrls } from '@support/steward/urls';

/** Performs a search by gtag and waits for the search to complete. */
export function goToTool(): void {
  cy.visit(stewardUrls.tools.gifting.default);
}

/** Clears user inputs and the current cart */
export function clearInputs(): void {
  cy.contains('mat-form-field', 'Search for an item').find('input').click().clear();
  cy.contains('mat-form-field', 'Quantity').find('input').click().clear();
  clickIfExists('[mattooltip="Remove item"]');
}
