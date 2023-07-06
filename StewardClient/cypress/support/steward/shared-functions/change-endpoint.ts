export function changeEndpoint(endpointToChange, endpointCurrentState, endpointDesiredState): void {
  cy.get('span').contains('mat-icon', 'settings').click();
  cy.get('mat-form-field')
    .contains('mat-label', endpointToChange + ' Endpoint')
    .parent()
    .parent()
    .parent()
    .contains('span', endpointCurrentState)
    .click();
  cy.get('mat-option').contains('span', endpointDesiredState).click();
  cy.get('span').contains('mat-icon', 'settings').click();
  cy.contains('span', 'Studio').should('exist');
}
