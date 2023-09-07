import { stewardUrls } from '@support/steward/urls';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import { resetToDefaultState } from '@support/page-utility/reset-to-default-state';

context('Steward / Support / Car Details / Woodstock', () => {
  before(() => {
    resetToDefaultState();
    cy.visit(stewardUrls.tools.carDetails.woodstock);
  });

  context('Valid Selections', () => {
    it('Should search for a valid car', () => {
      cy.contains('mat-form-field', 'Search for model').click().type('Ferrari');
      cy.contains('mat-option', 'Ferrari FXX (2005) [1006]').wait(1_000).click();
      waitForProgressSpinners();
      cy.contains('mat-card-header', 'Car Details').should('exist');
      cy.contains('mat-card-header', 'Car Flags').should('exist');
    });

    it('Should redirect to the default page when pressing the "clear input" button', () => {
      cy.contains('mat-icon', 'close').click();
      cy.contains('mat-card-header', 'Car Details').should('not.exist');
      cy.contains('mat-card-header', 'Car Flags').should('not.exist');
    });
  });

  context('Invalid Selections', () => {
    it('Should not be able to search for an invalid car', () => {
      cy.contains('mat-form-field', 'Search for model').click().type('Totally Real Car').wait(1000);
      cy.contains('mat-option', 'Totally Real Car').should('not.exist');
    });
  });

  context('Manual Redirection', () => {
    it("Should display car details if directed to a valid car's webpage", () => {
      cy.visit(stewardUrls.tools.carDetails.woodstock + '/1006');
      waitForProgressSpinners();
      cy.contains('mat-card-header', 'Car Details').should('exist');
      cy.contains('mat-card-header', 'Car Flags').should('exist');
    });
  });
});
