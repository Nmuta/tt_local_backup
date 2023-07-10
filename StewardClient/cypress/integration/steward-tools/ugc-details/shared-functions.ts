import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';

/** Enums for ugcids */
export enum woodstockUgcID {
  Livery = 'c5329e63-3c1f-4d60-b251-9e69cb2aeda7',
  LayerGroup = '307916c9-e492-4b57-af6e-815bb5e068f9',
  Photo = '12555e32-9e02-452b-b4ee-a1886c5a40a2',
  Tune = '27f5873f-de88-406d-829e-9eb8658cd511',
}

export enum SunriseUgcID {
  Livery = '0f8d8e88-6ecb-43ab-b386-6b56c9889390',
  Photo = 'cb276ca9-9e62-4493-bf21-5b1021de5098',
  Tune = '513c0c47-150b-45ca-912e-39d6728f6f9b',
  Events = '740b5d6a-5b10-44d1-882a-e647f42b910f',
}

/** Enums for ugcid created dates */
export enum woodstockUgcCreatedDate {
  Livery = '11/9/21 5:48:05 PM',
  LayerGroup = '2/8/22 11:40:02 AM',
  Photo = '2/8/22 3:13:50 PM',
  Tune = '2/8/22 3:16:11 PM',
}

export enum SunriseUgcCreatedDate {
  Livery = '3/15/21 8:30:02 AM',
  Photo = '1/10/21 8:06:05 PM',
  Tune = '12/3/20 5:15:51 PM',
  Events = '10/11/18 5:51:25 PM',
}

/** Fills in ugcid and confirms population */
export function testInputUgcID(ugcId: string): void {
  cy.get('mat-form-field')
    .contains('mat-label', 'UGC ID / Share Code')
    .parents('mat-form-field')
    .click()
    .type(ugcId);
  waitForProgressSpinners();

  cy.get('model-dump-simple-table').contains('div', ugcId).should('exist');
}

/** Verifies the correct date for a given ucgid */
export function verifyUgcCreatedDate(createdDate: string): void {
  cy.get('tr')
    .contains('th', 'Created Date Utc')
    .parent()
    .contains('div', createdDate)
    .should('exist');
}
