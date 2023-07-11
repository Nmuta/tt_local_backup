import { login } from '@support/steward/auth/login';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import { stewardUrls } from '@support/steward/urls';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';

context('Steward / Tools / Welcome Center Tiles / Steelhead', () => {
  beforeEach(() => {
    login();

    disableFakeApi();
    cy.visit(stewardUrls.tools.welcomeCenterTiles.steelhead);
  });

  context('WTC', () => {
    it('should create new Welcome Center Tile', () => {
      enableEdit();
      cy.get('mat-form-field')
        .contains('mat-label', 'Tile Title')
        .parents('mat-form-field')
        .click();
      cy.get('mat-option').contains('span', 'Test string').click();
      cy.get('mat-form-field')
        .contains('mat-label', 'Tile Description')
        .parents('mat-form-field')
        .click();
      cy.get('mat-option').contains('span', 'Test string').click();
      cy.get('mat-form-field').contains('mat-label', 'Tile Type').parents('mat-form-field').click();
      cy.get('mat-option').contains('span', 'Test string').click();
      cy.get('mat-form-field').contains('mat-label', 'Timer').parents('mat-form-field').click();
      cy.get('mat-option').contains('span', 'Series').click();
      cy.get('mat-form-field')
        .contains('mat-label', 'Select Series')
        .parents('mat-form-field')
        .click();
      cy.get('mat-option').contains('span', 'Test Entry Series').click();
      cy.get('mat-form-field')
        .contains('mat-label', 'Timer Start Text Override')
        .parents('mat-form-field')
        .click();
      cy.get('mat-option').contains('span', 'Test string').click();
      cy.get('mat-form-field')
        .contains('mat-label', 'Timer End Text Override')
        .parents('mat-form-field')
        .click();
      cy.get('mat-option').contains('span', 'Test string').click();
      cy.get('mat-form-field')
        .contains('mat-label', 'Popup Title')
        .parents('mat-form-field')
        .click();
      cy.get('mat-option').contains('span', 'Test string').click();
      cy.get('mat-form-field')
        .contains('mat-label', 'Popup Description')
        .parents('mat-form-field')
        .click();
      cy.get('mat-option').contains('span', 'Test string').click();
      cy.get('button').contains('mat-icon', 'lock_open').click();
      cy.get('button').contains('span', 'Submit Modification').click();
      waitForProgressSpinners();
      cy.contains('span', 'A pull request for your changes has been created').should('exist');
      cy.contains('a', 'Edits WoFTileGenericPopup from Steward. Author: Email not found').should(
        'exist',
      );
    });

    it('should abandon previously created pr', () => {
      waitForProgressSpinners();
      cy.contains('a', 'Edits WoFTileGenericPopup from Steward. Author: Email not found')
        .parents('tr')
        .contains('mat-icon', 'lock_open')
        .click();
      cy.contains('a', 'Edits WoFTileGenericPopup from Steward. Author: Email not found')
        .parents('tr')
        .contains('span', 'Abandon')
        .click();
      cy.contains('a', 'Edits WoFTileGenericPopup from Steward. Author: Email not found').should(
        'not.exist',
      );
    });

    it('should adjust language', () => {
      enableEdit();
      cy.get('mat-form-field')
        .contains('mat-label', 'Tile Title')
        .parents('mat-form-field')
        .click();
      cy.get('mat-option').contains('span', 'Test string').click();
      cy.contains('div', 'pl-PL').click();
      cy.contains('textarea', 'Testowy string').should('exist');
    });

    it('should show and hide Help Card', () => {
      cy.contains('mat-icon', 'help').click();
      cy.contains('mat-card-title', 'Verify Button').should('exist');
      cy.contains('span', 'Hide Verify Help Icon').click();
      cy.contains('mat-card-title', 'Verify Button').should('not.exist');
    });

    it('should not allow a MotD modification with incomplete fields', () => {
      enableEdit();
      cy.get('button').contains('mat-icon', 'lock_open').click();
      cy.get('button').contains('span', 'Submit Modification').parent().get('[disabled="true"]');
    });
  });

  context('Localization', () => {
    it('should create a localized message', () => {
      cy.contains('div', 'Localization').click();
      cy.get('mat-form-field')
        .contains('mat-label', 'String To Localize')
        .parents('mat-form-field')
        .click()
        .type('This is a test');
      cy.get('mat-form-field')
        .contains('mat-label', 'Description')
        .parents('mat-form-field')
        .click()
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
    .contains('mat-label', 'Select Welcome Center Tile')
    .parents('mat-form-field')
    .click();
  //wait to allow page to load after selecting an option, may need a progress spinner to eliminate the wait()
  cy.get('mat-option').contains('span', '[TEST] Pop-up Test').click().wait(2000);
  cy.get('button').contains('span', 'Edit').click();
}
