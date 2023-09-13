import { waitForProgressSpinners } from '../common/wait-for-progress-spinners';

export function changeEndpoint(endpointToChange, endpointCurrentState, endpointDesiredState): void {
  cy.get('span').contains('mat-icon', 'settings').click();
  cy.get('mat-form-field')
    .contains('mat-label', endpointToChange + ' Endpoint')
    .parents('mat-form-field')
    .click();
  cy.get('mat-option').contains('span', endpointDesiredState).click();
  waitForProgressSpinners();
  cy.get('span').contains('mat-icon', 'settings').click();
}
