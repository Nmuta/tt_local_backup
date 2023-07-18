// visits the login passthru URI
// follow the instructions in .login-credentials.ts if the import above fails
export function disableFakeApi(): Cypress.Chainable<Cypress.AUTWindow> {
  return cy.visit('/util/set-fake-api?enableFakeApi=false');
}
