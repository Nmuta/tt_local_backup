import { login } from '@support/steward/auth/login';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import { changeEndpoint } from '@support/steward/shared-functions/change-endpoint';
import { stewardUrls } from '@support/steward/urls';
import { clickTopLeftOfBody } from '@support/steward/util/click-top-left-of-body';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';

context('Steward / Support / Auction Blocklist / Woodstock', () => {
  beforeEach(() => {
    login();

    disableFakeApi();
    cy.visit(stewardUrls.tools.createAuction.woodstock);
    changeEndpoint('Woodstock', 'Retail', 'Studio');
  });

  it('should create an auction', () => {
    cy.contains('mat-form-field', 'Search for model').click().type('Ferrari');
    cy.contains('mat-option', 'Ferrari FXX (2005) [1006]').click();

    cy.contains('mat-form-field', 'Opening Price').click().type('1');
    cy.contains('mat-form-field', 'Buyout Price').click().type('100');
    cy.get('button').contains('span', '1 hour').parent().click();
    cy.contains('mat-form-field', 'Seller Id').click().type('1');

    cy.get('button').contains('lock_open').click();
    cy.contains('button', 'Create Auction').should('be.enabled');
  });

  it('should not create an auction with invalid car input', () => {
    cy.contains('mat-form-field', 'Search for model').click().type('Totally Real Car');
    cy.contains('mat-option', 'Totally Real Car').should('not.exist');

    clickTopLeftOfBody();

    cy.contains('mat-form-field', 'Opening Price').click().type('1');
    cy.contains('mat-form-field', 'Buyout Price').click().type('100');
    cy.get('button').contains('span', '1 hour').parent().click();
    cy.contains('mat-form-field', 'Seller Id').click().type('1');

    cy.get('button').contains('lock_open').click();
    cy.contains('button', 'Create Auction').should('be.disabled');
  });

  it('should not create an auction with invalid Price inputs', () => {
    cy.contains('mat-form-field', 'Search for model').click().type('Ferrari');
    cy.contains('mat-option', 'Ferrari FXX (2005) [1006]').click();

    cy.contains('mat-form-field', 'Opening Price').click().type('a');
    cy.contains('mat-form-field', 'Buyout Price').click().type('z');
    cy.get('button').contains('span', '1 hour').parent().click();
    cy.contains('mat-form-field', 'Seller Id').click().type('1');

    cy.get('button').contains('lock_open').click();
    cy.contains('button', 'Create Auction').should('be.disabled');
  });

  it('should not create an auction with invalid Seller Id inputs', () => {
    cy.contains('mat-form-field', 'Search for model').click().type('Ferrari');
    cy.contains('mat-option', 'Ferrari FXX (2005) [1006]').click();

    cy.contains('mat-form-field', 'Opening Price').click().type('1');
    cy.contains('mat-form-field', 'Buyout Price').click().type('100');
    cy.get('button').contains('span', '1 hour').parent().click();
    cy.contains('mat-form-field', 'Seller Id').click().type('a');

    cy.get('button').contains('lock_open').click();
    cy.contains('button', 'Create Auction').should('be.disabled');
  });
});
