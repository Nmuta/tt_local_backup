import { credentials } from './login-credentials';

// visits the login passthru URI
// follow the instructions in .login-credentials.ts if the import above fails
export function login(): Cypress.Chainable<Cypress.AUTWindow> {
  return cy.visit(credentials.syncPath);
}
