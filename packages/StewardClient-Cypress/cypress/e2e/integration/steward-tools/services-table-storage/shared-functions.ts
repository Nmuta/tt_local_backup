import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import { searchByGtag, searchByXuid } from '@support/steward/shared-functions/searching';

/** Interface for Lookup Results */
interface LookupResults {
  name: string;
  result: string;
  version: string;
}

/** Results for testing Woodstock */
export const woodstockResults: Record<string, LookupResults> = {
  noFilter: {
    name: '',
    result: 'NotificationsUser_',
    version: '8',
  },

  crossTitleHasPlayedRecordFilter: {
    name: 'CrossTitleHasPlayedRecord',
    result: 'CrossTitleHasPlayedRecord_CrossTitleHasPlayedRecord',
    version: '1111',
  },

  showAllRows: {
    name: '',
    result: 'Gift_3a4297c3-2b92-4163-84b5-9ff162ff9043',
    version: '1022',
  },
};

/** Results for testing Steelhead */
export const steelheadResults: Record<string, LookupResults> = {
  noFilter: {
    name: '',
    result: 'NotificationsUser_',
    version: '8',
  },

  CMSOverrideFilter: {
    name: 'CMSOverride',
    result: 'CMSOverride',
    version: '1049',
  },

  showAllRows: {
    name: '',
    result: 'GlobalProgressTracker_047d857d-0f0e-4e93-9e38-abdb0a72c758',
    version: '1064',
  },
};

/** Tests Invalid ID Searches */
export function testInvalidSearches(): void {
  context('Invalid Searches', () => {
    it('should not find invalid gtag', () => {
      searchByGtag('totallyRealGtag');
      cy.contains('h2', 'Request failed').should('exist');
      cy.contains('mat-icon', 'cancel').click();
    });

    it('should not find invalid xuid', () => {
      searchByXuid('010101010010101');
      cy.contains('h2', 'Request failed').should('exist');
      cy.contains('mat-icon', 'cancel').click();
    });
  });
}

/** Tests that Player Profiles is populated */
export function testPlayerProfilesPopulated(): void {
  it('should populate Player Profile', () => {
    cy.get('mat-chip').contains('mat-icon', 'person').should('exist');
  });
}

/** Tests the Lookup button without filters */
export function testLookup(results: LookupResults): void {
  it('should find results without a filter', () => {
    cy.get('button').contains('span', 'Lookup').parents('button').click();
    waitForProgressSpinners();
    cy.contains('mat-cell', results.result).should('exist');
    cy.get('mat-row')
      .contains('mat-cell', results.result)
      .parents('mat-row')
      .contains('mat-icon', 'expand_more')
      .parents('button')
      .click();
    cy.get('tr').contains('div', results.version).should('exist');
  });
}

/** Tests the Lookup button with filter */
export function testLookupWithFilter(results: LookupResults): void {
  it('should find results with a filter', () => {
    cy.get('mat-form-field')
      .contains('mat-label', 'Filter Results')
      .parents('mat-form-field')
      .click();
    cy.get('mat-option').contains('span', results.name).parents('mat-option').click();
    cy.contains('mat-cell', results.result).should('exist');
    cy.get('mat-row')
      .contains('mat-cell', results.result)
      .parents('mat-row')
      .contains('mat-icon', 'expand_more')
      .parents('button')
      .click();
    cy.get('tr').contains('div', results.version).should('exist');
    cy.get('button').contains('mat-icon', 'close').parents('button').click();
  });
}

/** Tests the Show All Rows Toggle */
export function testShowAllRows(results: LookupResults): void {
  it('should toggle the Show All Rows Button', () => {
    cy.contains('mat-cell', results.result).should('not.exist');
    cy.get('mat-slide-toggle').click();
    cy.get('button').contains('span', 'Lookup').parents('button').click();
    waitForProgressSpinners();
    cy.contains('mat-cell', results.result).should('exist');
    cy.get('mat-row')
      .contains('mat-cell', results.result)
      .parents('mat-row')
      .contains('mat-icon', 'expand_more')
      .parents('button')
      .click();
    cy.get('tr').contains('div', results.version).should('exist');
    cy.get('mat-slide-toggle').click();
    cy.get('button').contains('span', 'Lookup').parents('button').click();
  });
}

/** Tests the Lookup button with invalid filter */
export function testLookupWithInvalidFilter(): void {
  it('should not find results with an invalid filter', () => {
    cy.get('mat-form-field')
      .contains('mat-label', 'Filter Results')
      .parents('mat-form-field')
      .click()
      .type('TotallyRealFilter');
    cy.get('mat-option').should('not.exist');
    cy.contains('mat-cell', 'TotallyRealFilter').should('not.exist');
    cy.get('button').contains('mat-icon', 'close').parents('button').click();
  });
}
