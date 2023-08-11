import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import { clickTopLeftOfBody } from '@support/steward/util/click-top-left-of-body';

/** Test to ensure the environment is set up when the page is loaded */
export function testEnvLoads(): void {
  it('should display environment on page load', () => {
    waitForProgressSpinners();
    cy.get('[class="info-table"]').should('exist');
    cy.get('button').contains('span', 'Disable').should('exist');
    cy.get('button').contains('span', 'Run Now').should('exist');
    cy.get('button').contains('span', 'Edit').should('exist');
  });
}

/** Tests the Edit button and Undoes changes to task */
export function testEditButton(): void {
  context('Successful Edits', () => {
    before(() => {
      cy.get('button').contains('span', 'Edit').parents('button').click();
    });
    it('should edit a task and undo changes', () => {
      //the date entered must be in the future
      cy.get('mat-form-field')
        .contains('mat-label', 'Date')
        .parents('mat-form-field')
        .click()
        .type('{selectall}{backspace}9/1/2050');
      cy.get('mat-form-field')
        .contains('mat-label', 'Time')
        .parents('mat-form-field')
        .click()
        .type('{selectall}{backspace}12:00');
      cy.get('mat-form-field')
        .contains('mat-label', 'Period In Seconds')
        .parents('mat-form-field')
        .click()
        .type('{selectall}{backspace}10');
      cy.get('mat-form-field')
        .contains('mat-label', 'Period Type')
        .parents('mat-form-field')
        .click();
      cy.get('mat-option').contains('span', 'Non Deterministic').parents('mat-option').click();
      cy.get('button').contains('span', 'Submit').should('not.have.class', 'mat-button-disabled');
    });
    after(() => {
      cy.get('button').contains('span', 'Undo').parents('button').click();
    });
  });
}

/** Tests the Edit button, ensuring that invalid inputs cannot be submitted; and Undoes changes to task */
export function testInvalidEdits(): void {
  context('Invalid Tests', () => {
    beforeEach(() => {
      cy.get('button').contains('span', 'Edit').parents('button').click();
    });

    it('should edit a task with invalid date (past)', () => {
      //the date entered must be in the future in the mm/dd/yyyy format to be valid
      cy.get('mat-form-field')
        .contains('mat-label', 'Date')
        .parents('mat-form-field')
        .click()
        .type('{selectall}{backspace}9/1/2010');
      clickTopLeftOfBody();
      cy.get('[disabled="true"]').should('exist');
    });

    it('should edit a task with invalid date (non-number)', () => {
      cy.get('mat-form-field')
        .contains('mat-label', 'Date')
        .parents('mat-form-field')
        .click()
        .type('{selectall}{backspace}tomorrow');
      clickTopLeftOfBody();
      cy.get('[disabled="true"]').should('exist');
    });

    it('should edit a task with invalid time (empty)', () => {
      cy.get('mat-form-field')
        .contains('mat-label', 'Time')
        .parents('mat-form-field')
        .click()
        .type('{selectall}{backspace}');
      clickTopLeftOfBody();
      cy.get('[disabled="true"]').should('exist');
    });

    it('should edit a task with invalid time (non-number)', () => {
      cy.get('mat-form-field')
        .contains('mat-label', 'Time')
        .parents('mat-form-field')
        .click()
        .type('{selectall}{backspace}noon');
      clickTopLeftOfBody();
      cy.get('[disabled="true"]').should('exist');
    });

    it('should edit a task with empty Period In Seconds', () => {
      cy.get('mat-form-field')
        .contains('mat-label', 'Period In Seconds')
        .parents('mat-form-field')
        .click()
        .type('{selectall}{backspace}');
      clickTopLeftOfBody();
      cy.get('[disabled="true"]').should('exist');
    });

    afterEach(() => {
      cy.get('button').contains('span', 'Undo').parents('button').click();
    });
  });
}
