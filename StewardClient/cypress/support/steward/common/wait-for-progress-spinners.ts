/** Waits for progress spinners to be absent from the page. */
export function waitForProgressSpinners(
  timeout: number = 10_000,
): Cypress.Chainable<JQuery<HTMLElement>> {
  return cy.get('mat-progress-spinner', { timeout }).should('not.exist');
}
