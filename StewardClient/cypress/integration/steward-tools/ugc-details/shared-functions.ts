import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';

//** Fills in Livery ugcid and confirms population */
export function testLivery(ugcid, createdDate): void {
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

//** Fills in Layer Group ugcid and confirms population */
export function testLayerGroup(ugcid, createdDate): void {
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

//** Fills in Photo ugcid and confirms population */
export function testPhoto(ugcid, createdDate): void {
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

//** Fills in Tune ugcid and confirms population */
export function testTune(ugcid, createdDate): void {
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

//** Fills in Event ugcid and confirms population */
export function testEvents(ugcid, createdDate): void {
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

//** Fills in Community Challenge ugcid and confirms population */
export function testCommunityChallenge(ugcid, createdDate): void {
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

//** Fills in Tune Blob ugcid and confirms population */
export function testTuneBlob(ugcid, createdDate): void {
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