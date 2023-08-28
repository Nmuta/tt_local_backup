import { resetToDefaultState } from '@support/page-utility/reset-to-default-state';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import { stewardUrls } from '@support/steward/urls';
import { withTags, Tag } from '@support/tags';

context('Steward / Tools / Job History', withTags(Tag.Flakey), () => {
  before(() => {
    resetToDefaultState();
    cy.visit(stewardUrls.tools.jobHistory);
  });

  it('should select all entries over the last year', () => {
    cy.get('mat-form-field').contains('mat-label', 'From').parents('mat-form-field').click();
    cy.get('mat-option').contains('span', 'Last Year').parents('mat-option').click();
    waitForProgressSpinners();
    cy.get('[mat-row]').should('exist');
  });

  it('should select a job', () => {
    cy.get('[mat-row]').first().click();
    cy.contains('h3', 'Viewing results for job:').should('exist');
    cy.get('button').contains('span', 'Back to all results').should('exist');
  });

  it('should return to all results', () => {
    cy.get('button').contains('span', 'Back to all results').parents('button').click();
    cy.get('mat-form-field').contains('mat-label', 'From').should('exist');
    cy.get('[mat-row]').should('exist');
  });
});
