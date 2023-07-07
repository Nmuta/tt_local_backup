import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';

/** Enums for ugcids */
export enum woodstockUgcID {
  Livery = 'c5329e63-3c1f-4d60-b251-9e69cb2aeda7',
  LayerGroup = '307916c9-e492-4b57-af6e-815bb5e068f9',
  Photo = '12555e32-9e02-452b-b4ee-a1886c5a40a2',
  Tune = '27f5873f-de88-406d-829e-9eb8658cd511',
}

/** Enums for ugcid created dates */
export enum woodstockUgcCreatedDate {
  Livery = '11/9/21 5:48:05 PM',
  LayerGroup = '2/8/22 11:40:02 AM',
  Photo = '2/8/22 3:13:50 PM',
  Tune = '2/8/22 3:16:11 PM',
}

/** Fills in ugcid and confirms population */
export function testInputUgcID(ugcid): void {
  cy.get('mat-form-field')
    .contains('mat-label', 'UGC ID / Share Code')
    .parent()
    .parent()
    .parent()
    .click()
    .type(ugcid);
  waitForProgressSpinners();

  cy.get('model-dump-simple-table').contains('div', ugcid).should('exist');
}

/** Verifies the correct date for a given ucgid */
export function verifyUgcCreatedDate(createdDate): void {
  cy.get('tr')
    .contains('th', 'Created Date Utc')
    .parent()
    .contains('div', createdDate)
    .should('exist');
}
