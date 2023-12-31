import { resetToDefaultState } from '@support/page-utility/reset-to-default-state';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import { stewardUrls } from '@support/steward/urls';

context('Steward / Tools / Meta Tools', () => {
  before(() => {
    resetToDefaultState();
    cy.visit(stewardUrls.tools.metaTools.default);
  });

  context('Management', () => {
    before(() => {
      cy.contains('[role="tab"]', 'Release Management').click();
      waitForProgressSpinners();
    });
    it('Should have correct elements for release management tab', () => {
      cy.contains('button', 'sync').click();
      // We could test the slide toggle that disables and enables tools, but I don't want to do so unless approved.
      /*
      cy.contains('mat-slide-toggle', 'All tools available').within(() => {
        cy.get('input').click({force: true} );
        waitForProgressSpinners();
        cy.get('input').click({force: true} );
        waitForProgressSpinners();
      })
      */
    });
  });

  context('Kusto Management', () => {
    before(() => {
      cy.contains('[role="tab"]', 'Kusto Management').click();
      waitForProgressSpinners();
    });
    it('Should allow for loading and editing kusto queries in  kusto management tab', () => {
      cy.contains('button', 'Edit Kusto Query').should('be.disabled');
      cy.get('[id="mat-input-0"]').click();
      cy.get('mat-optgroup')
        .first()
        .within(() => {
          cy.get('mat-option').first().click();
        });
      cy.contains('button', 'Edit Kusto Query').click();
      cy.contains('section', 'Editing Kusto Query:').within(() => {
        cy.contains('button', 'Edit Kusto Query').should('not.be.disabled');
        cy.contains('button', 'Clear Input').should('not.be.disabled');
        cy.contains('button', 'Delete Kusto Query').should('not.be.disabled');
      });
    });
  });

  context('Kusto Management', () => {
    before(() => {
      cy.contains('[role="tab"]', 'Cache Management').click();
      waitForProgressSpinners();
    });
    it('Should allow for deleting cache keys in cache management tab', () => {
      cy.contains('button', 'Delete Key').should('be.disabled');
      cy.get('[id="mat-input-1"]').click().type('test');
      cy.contains('button', 'Delete Key').should('not.be.disabled');
    });
  });
});
