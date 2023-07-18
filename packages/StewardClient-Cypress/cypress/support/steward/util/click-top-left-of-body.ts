// Sets mouse click position to top left
export function clickTopLeftOfBody() {
  return cy.get('body').click('topLeft');
}
