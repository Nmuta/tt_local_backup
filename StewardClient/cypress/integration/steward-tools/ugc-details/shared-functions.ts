import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';

//** Fills in ugcid and confirms population */
export function testInputUGCID(ugcid, createdDate): void {
  cy.get('mat-form-field')
    .contains('mat-label', 'UGC ID / Share Code')
    .parent()
    .parent()
    .parent()
    .click()
    .type(ugcid);
  waitForProgressSpinners();

  cy.get('model-dump-simple-table').contains('div', ugcid).should('exist');
  cy.get('tr')
    .contains('th', 'Created Date Utc')
    .parent()
    .contains('div', createdDate)
    .should('exist');
}
