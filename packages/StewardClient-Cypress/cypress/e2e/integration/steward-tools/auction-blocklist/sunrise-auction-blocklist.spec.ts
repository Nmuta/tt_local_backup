import { resetToDefaultState } from '@support/page-utility/reset-to-default-state';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import { stewardUrls } from '@support/steward/urls';

// Test disabled against Retail, needs minor refactor and re-enable against Studio.
context('Steward / Support / Auction Blocklist / Sunrise', () => {
  before(() => {
    resetToDefaultState();
  });

  context('Auction House Blocklist lookup', () => {
    before(() => {
      cy.visit(stewardUrls.tools.auctionBlocklist.sunrise);
      waitForProgressSpinners(10_000);
    });

    it('should create table in ready state', () => {
      cy.get('table').find('tr').should('have.length.greaterThan', 5);
      cy.get('table').contains('tr', '1301').should('not.exist');
      cy.contains('button', 'Submit').should('be.disabled');
    });

    context('Creating, manipulating, and deleting an entry', () => {
      before(() => {
        cy.get('mat-progress-spinner', { timeout: 10_000 }).should('not.exist');
        cy.get('table').find('tr').should('have.length.greaterThan', 5);
        cy.get('table').contains('tr', '1301').should('not.exist');
        cy.contains('button', 'Submit').should('be.disabled');
        cy.contains('mat-form-field', 'Search for model').click().type('1301\n');
        cy.contains('.mat-option-text', 'Jaguar D-Type (1956) [1301]').click();
        cy.contains('mat-form-field', 'Expire Date (mm/dd/yyyy)').click().type('12/12/3999');
        cy.contains('button', 'Submit').should('be.enabled').click();
        cy.get('mat-progress-spinner', { timeout: 10_000 }).should('not.exist');
      });

      it('should have added entry to table', () => {
        cy.contains('td', '1301').siblings().contains('button', 'Delete').should('exist');
      });

      it('should be an editable entry', () => {
        cy.contains('td', '1301').siblings().contains('td', 'Never').should('not.exist');
        cy.contains('td', '1301').siblings().contains('button', 'Edit').click();
        cy.contains('td', '1301').siblings().contains('button', 'Submit').should('exist');
        cy.contains('td', '1301').siblings().contains('button', 'Undo').should('exist');
        cy.contains('td', '1301').siblings().get('[type="checkbox"]').should('exist');
        cy.contains('td', '1301').siblings().get('[type="checkbox"]').should('be.checked');
        cy.contains('td', '1301').siblings().get('[type="checkbox"]').uncheck({ force: true });
        cy.contains('td', '1301').siblings().contains('button', 'Submit').click();
        cy.get('mat-progress-spinner', { timeout: 10_000 }).should('not.exist');
        cy.contains('td', '1301').siblings().contains('td', 'Never').should('exist');
        cy.contains('td', '1301').siblings().contains('button', 'Edit').should('exist');
      });

      after(() => {
        cy.contains('td', '1301')
          .siblings()
          .contains('button', 'Delete')
          .should('exist')
          .should('not.be.enabled');
        cy.contains('td', '1301')
          .siblings()
          .contains('button', 'Delete')
          .siblings()
          .contains('mat-icon', 'lock_open')
          .click();
        cy.contains('td', '1301')
          .siblings()
          .contains('button', 'Delete')
          .should('exist')
          .should('be.enabled')
          .click();
        cy.get('table').contains('tr', '1301').should('not.exist');
      });
    });
  });
});
