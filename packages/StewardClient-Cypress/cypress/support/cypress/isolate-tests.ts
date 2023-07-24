/**
 * Clears test state as described in https://docs.cypress.io/guides/core-concepts/test-isolation
 */
export function isolateTests() {
  // https://docs.cypress.io/guides/core-concepts/test-isolation
  cy.visit('about:blank');
  cy.clearAllCookies();
  cy.clearAllLocalStorage();
  cy.clearAllSessionStorage();
}
