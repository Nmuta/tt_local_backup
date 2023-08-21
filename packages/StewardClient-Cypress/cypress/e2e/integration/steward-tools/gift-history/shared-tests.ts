import { clickIfExists } from '@support/cypress/click-if-exists';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import {
  searchByGtag,
  searchByXuid,
  selectLspGroup,
} from '@support/steward/shared-functions/searching';

/** Verifies that some invalid Gtag will return no gift history */
export function verifySearchInvalidGtagEmptyHistoryTest(): void {
  it('should have no gift history for an invalid gamertag', () => {
    clickIfExists('player-selection-single mat-chip mat-icon[matchipremove]');
    searchByGtag('I am an invalid gamertag that should not work');
    waitForProgressSpinners();
    cy.get('gift-history-results').find('mat-expansion-panel').should('not.exist');
    cy.get('gift-history-results').should('contain', 'No gift history found.');
  });
}

/** Verifies that a valid Gtag with gifts will return gift history information */
export function verifySearchValidGtagGiftsExistsTest(gtag: string): void {
  it('should have gift history for a valid gtag with gifts', () => {
    clickIfExists('player-selection-single mat-chip mat-icon[matchipremove]');
    searchByGtag(gtag);
    waitForProgressSpinners();
    cy.get('gift-history-results')
      .find('mat-expansion-panel')
      .contains('Credit Rewards')
      .should('exist');
  });
}

/** Verifies that an invalid Xuid will return no gift history */
export function verifySearchInvalidXuidEmptyHistoryTest(): void {
  it('should have no gift history for an invalid xuid', () => {
    clickIfExists('player-selection-single mat-chip mat-icon[matchipremove]');
    searchByXuid('I am an invalid xuid that should not work');
    waitForProgressSpinners();
    cy.get('gift-history-results').find('mat-expansion-panel').should('not.exist');
    cy.get('gift-history-results').should('contain', 'No gift history found.');
  });
}

/** Verifies that a valid Xuid with gifts will return gift history information */
export function verifySearchValidXuidGiftsExistsTest(xuid: string): void {
  it('should have gift history for a valid xuid with gifts', () => {
    clickIfExists('player-selection-single mat-chip mat-icon[matchipremove]');
    searchByXuid(xuid);
    waitForProgressSpinners();
    cy.get('gift-history-results')
      .find('mat-expansion-panel')
      .contains('Credit Rewards')
      .should('exist');
  });
}

/** Verifies that a valid Xuid with gifts will return accurate gift history information when date filtered for days that a specified number of gifts were sent*/
export function verifyGiftHistoryCalendarWhereGiftsExist(
  xuid: string,
  date1: string,
  date2: string,
  numExpectedGifts: number,
): void {
  it('should have gift history for a valid xuid during a specific period when there was a gift', () => {
    clickIfExists('player-selection-single mat-chip mat-icon[matchipremove]');
    searchByXuid(xuid);
    waitForProgressSpinners();
    cy.get('.date-range').then(body =>{
      if (body.find('input[type="checkbox"][aria-checked="false"]').length > 0) {
          cy.get('input[type="checkbox"][aria-checked="false"]').click({ force: true });
        }
    });
    cy.get('.mat-date-range-input-start-wrapper').find('input').clear();
    cy.get('.mat-date-range-input-start-wrapper').type(date1);
    cy.get('.mat-date-range-input-end-wrapper').find('input').clear();
    cy.get('.mat-date-range-input-end-wrapper').type(date2);
    cy.get('gift-history-results')
      .find('mat-accordion')
      .children()
      .should('have.length', numExpectedGifts);
    //cy.get('.date-range').find('input[type="checkbox"], input[aria-checked="false"]').click({ force: true });
  });
}

/** Verifies that a valid Xuid with gifts will return no gift history information when date filtered for days that gifts were not sent*/
export function verifyGiftHistoryCalendarWhereGiftsDoNotExist(
  xuid: string,
  date1: string,
  date2: string,
): void {
  it('should not show gift history for a valid xuid during a specific period when there were no gifts', () => {
    clickIfExists('player-selection-single mat-chip mat-icon[matchipremove]');
    searchByXuid(xuid);
    waitForProgressSpinners();
    cy.get('.date-range').then(body =>{
      if (body.find('input[type="checkbox"][aria-checked="false"]').length > 0) {
          cy.get('input[type="checkbox"][aria-checked="false"]').click({ force: true });
        }
    });
    cy.get('.mat-date-range-input-start-wrapper').find('input').clear();
    cy.get('.mat-date-range-input-start-wrapper').type(date1);
    cy.get('.mat-date-range-input-end-wrapper').find('input').clear();
    cy.get('.mat-date-range-input-end-wrapper').type(date2);
    cy.get('gift-history-results').find('mat-expansion-panel').should('not.exist');
    cy.get('gift-history-results').should('contain', 'No gift history found');
    cy.get('.date-range').find('input[type="checkbox"]').click({ force: true });
  });
}

/** Verifies that a valid Xuid with gifts will return gift history information */
export function verifySearchValidLspGroupHistoryGiftsExistsTest(lspGroup: string): void {
  it('should have history for a valid LspGroup with gift history', () => {
    cy.contains('div', 'LSP Group Selection').click();
    cy.contains('mat-form-field', 'Select LSP Group').find('input').clear();
    selectLspGroup(lspGroup);
    waitForProgressSpinners();
    cy.get('gift-history-results').find('mat-expansion-panel').should('exist');
  });
}

/** Verifies that a valid Lsp Group with gifts will return accurate gift history information when date filtered for days that a specified number of gifts were sent*/
export function verifySearchValidLspGroupHistoryGiftsExistsCalendarTest(
  lspGroup: string,
  date1: string,
  date2: string,
  numExpectedGifts?: number,
): void {
  it('should have gift history during a specific period when there were gifts', () => {
    cy.contains('div', 'LSP Group Selection').click();
    cy.contains('mat-form-field', 'Select LSP Group').find('input').clear();
    selectLspGroup(lspGroup);
    waitForProgressSpinners();
    cy.get('.date-range').then(body =>{
      if (body.find('input[type="checkbox"][aria-checked="false"]').length > 0) {
          cy.get('input[type="checkbox"][aria-checked="false"]').click({ force: true });
        }
    });
    cy.get('.mat-date-range-input-start-wrapper').find('input').clear();
    cy.get('.mat-date-range-input-start-wrapper').type(date1);
    cy.get('.mat-date-range-input-end-wrapper').find('input').clear();
    cy.get('.mat-date-range-input-end-wrapper').type(date2);
    cy.get('gift-history-results')
      .find('mat-accordion')
      .children()
      .should('have.length', numExpectedGifts);
  });
}
