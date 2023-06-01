import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import { searchByGtag, searchByXuid, selectLspGroup } from './page';

export function verifySearchInvalidGtagEmptyHistoryTest(): void {
  it('should have no gift history for an invalid gamertag', () => {
    searchByGtag('I am an invalid gamertag that should not work');
    waitForProgressSpinners();
    cy.get('gift-history-results').contains('Community gift.').should('not.exist');
    cy.get('gift-history-results').should('contain', 'No gift history found.');
  });
}

export function verifySearchValidGtagGiftsExistsTest(gtag: string): void {
  it('should have gift history for a valid gtag with gifts', () => {
    searchByGtag(gtag);
    waitForProgressSpinners();
    //cy.get('gift-history-results').should('contain', 'Community gift.');
    cy.get('gift-history-results').find('mat-expansion-panel').should('exist');
  });
}

export function verifySearchInvalidXuidEmptyHistoryTest(): void {
  it('should have no gift history for an invalid xuid', () => {
    searchByXuid('I am an invalid xuid that should not work');
    waitForProgressSpinners();
    cy.get('gift-history-results').contains('Community gift.').should('not.exist');
    cy.get('gift-history-results').should('contain', 'No gift history found.');
  });
}

export function verifySearchValidXuidGiftsExistsTest(xuid: string): void {
  it('should have gift history for a valid xuid with gifts', () => {
    searchByXuid(xuid);
    waitForProgressSpinners();
    cy.get('gift-history-results').find('mat-expansion-panel').should('exist');
  });
}

export function verifyGiftHistoryCalendarWhereGiftsExist(
  xuid: string,
  date1: string,
  date2: string,
): void {
  //date1 or date2 should specifically be a gift
  //const regex = new RegExp(`${date1 + '|' + date2}`, 'g')
  it('should have gift history for a valid xuid during a specific period when there was a gift', () => {
    searchByXuid(xuid);
    waitForProgressSpinners();
    cy.get('[class*="date-range"]').find('input[type="checkbox"]').click({ force: true });
    cy.get('[class*="mat-date-range-input-start-wrapper"]').clear().type(date1); // 2/7/2023
    cy.get('[class*="mat-date-range-input-end-wrapper"]').clear().type(date2);
    cy.get('gift-history-results').find('mat-expansion-panel').should('have.length', 2); //this may not work, needs testing
    //cy.get('gift-history-results').find('mat-expansion-panel').contains(date2).should('have.length', 1);
  });
}

export function verifyGiftHistoryCalendarWhereGiftsDoNotExist(
  xuid: string,
  date1: string,
  date2: string,
): void {
  it('should not show gift history for a valid xuid during a specific period when there were no gifts', () => {
    searchByXuid(xuid);
    waitForProgressSpinners();
    cy.get('[class*="date-range"]').find('input[type="checkbox"]').click({ force: true });
    cy.get('[class*="mat-date-range-input-start-wrapper"]').clear().type(date1); // '1/1/2023'
    cy.get('[class*="mat-date-range-input-end-wrapper"]').clear().type(date2);
    cy.get('gift-history-results').find('mat-expansion-panel').should('have.length', 0);
    cy.get('gift-history-results').should('contain', 'No gift history found');
  });
}

export function verifySearchValidLspGroupHistoryGiftsExistsTest(lspGroup: string): void {
  it('should have history for a valid LspGroup with gift history', () => {
    selectLspGroup(lspGroup);
    waitForProgressSpinners();
    cy.get('gift-history-results').should('contain', 'Community gift.');
  });
}

export function verifySearchValidLspGroupHistoryGiftsExistsCalendarTest(
  lspGroup: string,
  date1: string,
  date2: string,
): void {
  it('should have gift history during a specific period when there were gifts', () => {
    selectLspGroup(lspGroup);
    waitForProgressSpinners();
    cy.get('[class*="date-range"]').find('input[type="checkbox"]').click({ force: true });
    cy.get('[class*="mat-date-range-input-start-wrapper"]').clear().type(date1);
    cy.get('[class*="mat-date-range-input-end-wrapper"]').clear().type(date2);
    cy.get('gift-history-results').contains('Community gift.').should('have.length', 2);
    //cy.get('gift-history-results').contains(' 9/20/22, 12:00 PM ').should('have.length', 1);
  });
}
