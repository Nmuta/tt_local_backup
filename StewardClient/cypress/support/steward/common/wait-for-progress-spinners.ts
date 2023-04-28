/** Waits for progress spinners to be absent from the page. */
export function waitForProgressSpinners(
  timeout: number = 30_000,
  spinnerName: string = 'mat-spinner',
): Cypress.Chainable<JQuery<HTMLElement>> {
  return cy.get(spinnerName, { timeout }).should('not.exist');
}
