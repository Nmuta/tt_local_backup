import { login } from '@support/steward/auth/login';
import { stewardUrls } from '@support/steward/urls';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { jordan, emerson } from '@support/steward/common/account-info';

// Test disabled against Retail, needs minor refactor and re-enable against Studio.
context('Steward / Tools / Ban Review', () => {
  beforeEach(async () => {
    await login();
    disableFakeApi();

    cy.visit(stewardUrls.tools.bulkBanHistory);
    cy.get('mat-progress-spinner', { timeout: 10_000 }).should('not.exist');
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
      beforeEach(() => {
        cy.get('textarea').click().type(`${jordan.xuid}\n${emerson.xuid}`);
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

          // Lookup results
          cy.get('tr').filter('.mat-row').should('have.length', 2);
        });
      });
    });
  });
});
