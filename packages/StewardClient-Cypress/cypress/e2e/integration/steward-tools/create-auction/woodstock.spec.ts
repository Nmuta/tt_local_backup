import { resetToDefaultState } from '@support/page-utility/reset-to-default-state';
import { changeEndpoint } from '@support/steward/shared-functions/change-endpoint';
import { stewardUrls } from '@support/steward/urls';
import { clickTopLeftOfBody } from '@support/steward/util/click-top-left-of-body';

context('Steward / Support / Auction Blocklist / Woodstock', () => {
  before(() => {
    resetToDefaultState();
    cy.visit(stewardUrls.tools.createAuction.woodstock);
    changeEndpoint('Woodstock', 'Retail', 'Studio');
    cy.get('a').contains('span', 'FH5').contains('span', 'Studio').should('exist');
  });

  it('should create an auction', () => {
    cy.contains('mat-form-field', 'Search for model').type('Ferrari');
    cy.contains('mat-option', 'Ferrari FXX (2005) [1006]').click();

    cy.contains('mat-form-field', 'Opening Price').type('1');
    cy.contains('mat-form-field', 'Buyout Price').type('100');
    cy.get('button').contains('span', '1 hour').parent().click();
    cy.contains('mat-form-field', 'Seller Id').type('1');

    cy.get('button').contains('lock_open').click();
    cy.contains('button', 'Create Auction', { matchCase: false }).should(
      'not.have.class',
      'mat-button-disabled',
    );
    cy.get('button').contains('lock').click();
    cy.contains('mat-form-field', 'Search for model').type('{selectAll}{backspace}');
    clickTopLeftOfBody();
    cy.contains('mat-form-field', 'Opening Price').type('{selectAll}{backspace}');
    cy.contains('mat-form-field', 'Buyout Price').type('{selectAll}{backspace}');
    cy.contains('mat-form-field', 'Seller Id').type('{selectAll}{backspace}');
  });

  it('should not create an auction with invalid car input', () => {
    cy.contains('mat-form-field', 'Search for model').type('Totally Real Car');
    cy.contains('mat-option', 'Totally Real Car').should('not.exist');

    clickTopLeftOfBody();

    cy.contains('mat-form-field', 'Opening Price').type('1');
    cy.contains('mat-form-field', 'Buyout Price').type('100');
    cy.get('button').contains('span', '1 hour').parent().click();
    cy.contains('mat-form-field', 'Seller Id').type('1');

    cy.get('button').contains('lock_open').click();
    cy.contains('button', 'Create Auction', { matchCase: false }).should(
      'have.class',
      'mat-button-disabled',
    );
    cy.get('button').contains('lock').click();
    cy.contains('mat-form-field', 'Search for model').type('{selectAll}{backspace}');
    clickTopLeftOfBody();
    cy.contains('mat-form-field', 'Opening Price').type('{selectAll}{backspace}');
    cy.contains('mat-form-field', 'Buyout Price').type('{selectAll}{backspace}');
    cy.contains('mat-form-field', 'Seller Id').type('{selectAll}{backspace}');
  });

  it('should not create an auction with invalid Price inputs', () => {
    cy.contains('mat-form-field', 'Search for model').type('Ferrari');
    cy.contains('mat-option', 'Ferrari FXX (2005) [1006]').click();

    cy.contains('mat-form-field', 'Opening Price').type('a');
    cy.contains('mat-form-field', 'Buyout Price').type('z');
    cy.get('button').contains('span', '1 hour').parent().click();
    cy.contains('mat-form-field', 'Seller Id').type('1');

    cy.get('button').contains('lock_open').click();
    cy.contains('button', 'Create Auction', { matchCase: false }).should(
      'have.class',
      'mat-button-disabled',
    );
    cy.get('button').contains('lock').click();
    cy.contains('mat-form-field', 'Search for model').type('{selectAll}{backspace}');
    clickTopLeftOfBody();
    cy.contains('mat-form-field', 'Opening Price').type('{selectAll}{backspace}');
    cy.contains('mat-form-field', 'Buyout Price').type('{selectAll}{backspace}');
    cy.contains('mat-form-field', 'Seller Id').type('{selectAll}{backspace}');
  });

  it('should not create an auction with invalid Seller Id inputs', () => {
    cy.contains('mat-form-field', 'Search for model').click().type('Ferrari');
    cy.contains('mat-option', 'Ferrari FXX (2005) [1006]').click();

    cy.contains('mat-form-field', 'Opening Price').click().type('1');
    cy.contains('mat-form-field', 'Buyout Price').click().type('100');
    cy.get('button').contains('span', '1 hour').parent().click();
    cy.contains('mat-form-field', 'Seller Id').click().type('a');

    cy.get('button').contains('lock_open').click();
    cy.contains('button', 'Create Auction', { matchCase: false }).should(
      'have.class',
      'mat-button-disabled',
    );
    cy.get('button').contains('lock').click();
    cy.contains('mat-form-field', 'Search for model').type('{selectAll}{backspace}');
    clickTopLeftOfBody();
    cy.contains('mat-form-field', 'Opening Price').type('{selectAll}{backspace}');
    cy.contains('mat-form-field', 'Buyout Price').type('{selectAll}{backspace}');
    cy.contains('mat-form-field', 'Seller Id').type('{selectAll}{backspace}');
  });
});
