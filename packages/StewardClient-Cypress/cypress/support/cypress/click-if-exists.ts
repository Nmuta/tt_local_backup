/**
 * Click element if the given selector is found.
 * Based on https://stackoverflow.com/questions/47773525/how-to-check-for-an-element-that-may-not-exist-using-cypress
 */
export function clickIfExists(selector: string): void {
  // TODO: Find a package with this in Chainable format, or make our own.
  cy.get('body').then((body) => {
    if (body.find(selector).length > 0) {
      cy.get(selector).click();
    }
  });
}