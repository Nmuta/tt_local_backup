import env from '@support/env';

// follow the instructions in /.cypress.env.json to configure this
export function login(): Cypress.Chainable<Cypress.AUTWindow> {
  return cy.visit(env.syncPath);
}
