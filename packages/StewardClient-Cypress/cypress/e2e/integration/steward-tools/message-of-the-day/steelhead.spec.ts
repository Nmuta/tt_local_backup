import { resetToDefaultState } from '@support/page-utility/reset-to-default-state';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import { stewardUrls } from '@support/steward/urls';
import { clickTopLeftOfBody } from '@support/steward/util/click-top-left-of-body';
import { withTags, Tag } from '@support/tags';

context('Steward / Tools / Message of the Day / Steelhead', () => {
  before(() => {
    resetToDefaultState();
    cy.visit(stewardUrls.tools.messageOfTheDay.steelhead);
    waitForProgressSpinners();
  });

  context('MotD', () => {
    it('should create new message of the day', () => {
      enableEdit();
      cy.get('mat-form-field')
        .contains('mat-label', 'Title Header')
        .parents('mat-form-field')
        .click();
      cy.get('mat-option').contains('span', 'Test string').click();
      cy.get('mat-form-field')
        .contains('mat-label', 'Content Header')
        .parents('mat-form-field')
        .click();
      cy.get('mat-option').contains('span', 'Test string').click();
      cy.get('mat-form-field')
        .contains('mat-label', 'Content Body')
        .parents('mat-form-field')
        .click();
      cy.get('mat-option').contains('span', 'Test string').click();
      cy.get('button').contains('mat-icon', 'lock_open').click();
      cy.get('button').contains('span', 'Submit Modification').click();
      waitForProgressSpinners();
      cy.contains('span', 'A pull request for your changes has been created').should('exist');
      cy.contains('a', 'Edits MessageOfTheDay from Steward. Author: Email not found').should(
        'exist',
      );
    });

    it('should abandon previously created pr', () => {
      waitForProgressSpinners();
      cy.contains('a', 'Edits MessageOfTheDay from Steward. Author: Email not found')
        .parents('tr')
        .contains('mat-icon', 'lock_open')
        .click();
      cy.contains('a', 'Edits MessageOfTheDay from Steward. Author: Email not found')
        .parents('tr')
        .contains('span', 'Abandon')
        .click();
      cy.contains('a', 'Edits MessageOfTheDay from Steward. Author: Email not found').should(
        'not.exist',
      );
    });

    it('should adjust language', () => {
      enableEdit();
      cy.contains('div', 'pl-PL').click();
      cy.contains('textarea', 'Testowy string').should('exist');
    });

    it('should show and hide Help Card', () => {
      cy.contains('mat-icon', 'help').click();
      cy.contains('mat-card-title', 'Verify Button').should('exist');
      clickTopLeftOfBody();
      cy.contains('mat-card-title', 'Verify Button').should('not.exist');
    });

    it('should not allow a MotD modification with incomplete fields', withTags(Tag.Broken), () => {
      cy.get('mat-form-field')
        .contains('mat-label', 'Content Image Path')
        .parents('mat-form-field')
        .type('{selectAll}{backspace}');
      cy.get('button').contains('mat-icon', 'lock_open').click();
      cy.contains('button', 'Submit Modification', { matchCase: false }).should(
        'have.class',
        'mat-button-disabled',
      );
    });
  });

  context('Localization', () => {
    it('should create a localized message', () => {
      cy.contains('div', 'Localization').click();
      cy.get('mat-form-field')
        .contains('mat-label', 'String To Localize')
        .parents('mat-form-field')
        .type('This is a test');
      cy.get('mat-form-field')
        .contains('mat-label', 'Description')
        .parents('mat-form-field')
        .type('This is a description');
      cy.get('mat-form-field').contains('mat-label', 'Category').parents('mat-form-field').click();
      cy.get('mat-option').contains('span', 'MOTD').click();
      cy.get('mat-form-field')
        .contains('mat-label', 'Sub-Category')
        .parents('mat-form-field')
        .click();
      cy.get('mat-option').contains('span', 'Description').click();
      cy.get('button').contains('mat-icon', 'lock_open').click();
      cy.get('button').contains('span', 'Submit').click();
      waitForProgressSpinners();
      cy.contains('a', 'Edits LocalizationString from Steward. Author: Email not found').should(
        'exist',
      );
    });

    it('should abandon previously created pr', () => {
      cy.contains('div', 'Localization').click();
      cy.contains('a', 'Edits LocalizationString from Steward. Author: Email not found')
        .parents('tr')
        .contains('mat-icon', 'lock_open')
        .click();
      cy.contains('a', 'Edits LocalizationString from Steward. Author: Email not found')
        .parents('tr')
        .contains('span', 'Abandon')
        .click();
      cy.contains('a', 'Edits LocalizationString from Steward. Author: Email not found').should(
        'not.exist',
      );
    });

    it('should not allow a Localization with incomplete fields', () => {
      cy.contains('div', 'Localization').click();
      cy.get('button').contains('mat-icon', 'lock_open').click();
      cy.get('button').contains('span', 'Submit').parent().get('[disabled="true"]');
    });
  });
});

function enableEdit(): void {
  waitForProgressSpinners();
  cy.get('mat-form-field')
    .contains('mat-label', 'Select Message Of The Day')
    .parents('mat-form-field')
    .click();
  //wait to allow page to load after selecting an option, may need a progress spinner to eliminate the wait()
  cy.get('mat-option').contains('span', 'INTERNAL ONLY - Default MOTD').click().wait(2000);
  cy.get('button').contains('span', 'Edit').click();
}
