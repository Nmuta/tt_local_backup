/** Waits for progress spinners to be absent from the page. */
export function waitForProgressSpinners(
  timeout: number = 30_000,
): Cypress.Chainable<JQuery<HTMLElement>> {
  return (
    cy.get('mat-spinner', { timeout }).should('not.exist') &&
    cy.get('mat-progress-spinner', { timeout: 30_000 }).should('not.exist')
  );
}
