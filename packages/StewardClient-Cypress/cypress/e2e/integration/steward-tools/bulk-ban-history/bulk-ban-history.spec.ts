import { stewardUrls } from '@support/steward/urls';
import { RetailUsers } from '@support/steward/common/account-info';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import { resetToDefaultState } from '@support/page-utility/reset-to-default-state';

// Test disabled against Retail, needs minor refactor and re-enable against Studio.
context('Steward / Tools / Ban Review', () => {
  before(() => {
    resetToDefaultState();

    cy.visit(stewardUrls.tools.bulkBanHistory);
    waitForProgressSpinners(10_000);
  });

  context('Initialization', () => {
    it('should have all title retail endpoints selected', () => {
      cy.get('#woodstock-envs-select')
        .should('exist')
        .click()
        .get('mat-option')
        .filter(':contains("Retail")')
        .get('mat-pseudo-checkbox')
        .should('have.class', 'mat-pseudo-checkbox-checked');

      cy.get('body').click(); // Remove focus from select dropdown

      cy.get('#sunrise-envs-select')
        .should('exist')
        .click()
        .get('mat-option')
        .filter(':contains("Retail")')
        .get('mat-pseudo-checkbox')
        .should('have.class', 'mat-pseudo-checkbox-checked');

      cy.get('body').click(); // Remove focus from select dropdown

      cy.get('#apollo-envs-select')
        .should('exist')
        .click()
        .get('mat-option')
        .filter(':contains("Retail")')
        .get('mat-pseudo-checkbox')
        .should('have.class', 'mat-pseudo-checkbox-checked');

      cy.get('body').click(); // Remove focus from select dropdown
    });

    it('should have lookup button disabled', () => {
      cy.contains('button', 'Lookup XUIDs', { matchCase: false }).should(
        'have.class',
        'mat-button-disabled',
      );
    });
  });

  context('Search', () => {
    context('When XUIDs input is filled out', () => {
      before(() => {
        cy.get('textarea')
          .click()
          .type(`${RetailUsers['jordan'].xuid}\n${RetailUsers['luke'].xuid}`);
      });

      it('should activate the lookup button', () => {
        cy.contains('button', 'Lookup XUIDs', { matchCase: false }).should(
          'not.have.class',
          'mat-button-disabled',
        );
      });

      context('and lookup is clicked', () => {
        it('should display results', () => {
          cy.contains('button', 'Lookup XUIDs', { matchCase: false }).click();

          // Summary of lookup
          cy.contains('li', 'Total players: 2').should('exist');
          cy.contains('li', 'Environments Searched: 3').should('exist');

          waitForProgressSpinners();

          // Lookup results
          cy.get('tr').filter('.mat-row').should('have.length', 2);
        });
      });
    });
  });
});
