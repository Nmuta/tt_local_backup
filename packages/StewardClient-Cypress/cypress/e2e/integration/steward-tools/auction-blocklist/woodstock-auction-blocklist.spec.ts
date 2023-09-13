import { resetToDefaultState } from '@support/page-utility/reset-to-default-state';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import { stewardUrls } from '@support/steward/urls';

// Test disabled against Retail, needs minor refactor and re-enable against Studio.
context('Steward / Support / Auction Blocklist / Woodstock', () => {
  before(() => {
    resetToDefaultState();
  });

  // Enable tests when Woodstock has testable content in Prod.
  context('Auction House Blocklist lookup', () => {
    before(() => {
      cy.visit(stewardUrls.tools.auctionBlocklist.woodstock);
      waitForProgressSpinners(10_000);
    });

    it('should create table in ready state', () => {
      cy.get('table').find('tr').should('have.length.greaterThan', 5);
      cy.get('table').contains('tr', '1493').should('exist');
    });

    context('filtering entries', () => {
      it('should filter to existing data in table', () => {
        cy.contains('mat-form-field', 'Series').type('{selectAll}{backspace}21');
        cy.contains('mat-form-field', 'Keyword').type('{selectAll}{backspace}Volkswagen');
        waitForProgressSpinners(10_000);
        cy.get('table').contains('tr', '1493').should('not.exist');
        cy.get('table').contains('tr', '3664').should('exist');
      });

      it('should filter with invalid fields', () => {
        cy.contains('mat-form-field', 'Series').type('{selectAll}{backspace}10000');
        cy.contains('mat-form-field', 'Keyword').type('{selectAll}{backspace}TotallyRealMake');
        waitForProgressSpinners(10_000);
        cy.get('table').contains('tr', '1493').should('not.exist');
        cy.get('table').contains('tr', '3664').should('not.exist');
      });
    });
  });
});
