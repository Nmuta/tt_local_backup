import { resetToDefaultState } from '@support/page-utility/reset-to-default-state';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import { stewardUrls } from '@support/steward/urls';
import { withTags, Tag } from '@support/tags';

context('Steward / Tools / Product Pricing', () => {
  before(() => {
    resetToDefaultState();
    cy.visit(stewardUrls.tools.productPricing.default);
  });

  it('should populate pricing on page load FH5 Standard Edition', withTags(Tag.Broken), () => {
    cy.get('mat-form-field').contains('span', 'Select Product').parents('mat-form-field').click();
    cy.get('mat-option').contains('span', 'Forza Horizon 5 Standard Edition').click();
    waitForProgressSpinners();

    cy.contains('td', 'CNY').parent().contains('td', '248').should('exist');
    cy.contains('td', 'USD').parent().contains('td', '59.99').should('exist');
    cy.contains('td', 'EUR').parent().contains('td', '49.98').should('exist');
    cy.contains('td', 'JPY').parent().contains('td', '7590').should('exist');
  });

  it('should populate pricing on page load FM Standard Edition', () => {
    cy.get('mat-form-field').contains('span', 'Select Product').parents('mat-form-field').click();
    cy.get('mat-option').contains('span', 'Forza Motorsport Standard Edition').click();
    waitForProgressSpinners();

    cy.contains('td', 'CNY').parent().contains('td', '298').should('exist');
    cy.contains('td', 'USD').parent().contains('td', '69.99').should('exist');
    cy.contains('td', 'EUR').parent().contains('td', '69.99').should('exist');
    cy.contains('td', 'JPY').parent().contains('td', '9680').should('exist');
  });

  it('should populate pricing on page load FM Deluxe Edition', () => {
    cy.get('mat-form-field').contains('span', 'Select Product').parents('mat-form-field').click();
    cy.get('mat-option').contains('span', 'Forza Motorsport Deluxe Edition').click();
    waitForProgressSpinners();

    cy.contains('td', 'CNY').parent().contains('td', '348').should('exist');
    cy.contains('td', 'USD').parent().contains('td', '89.99').should('exist');
    cy.contains('td', 'EUR').parent().contains('td', '89.99').should('exist');
    cy.contains('td', 'JPY').parent().contains('td', '11880').should('exist');
  });

  it('should populate pricing on page load FM Premium Edition', () => {
    cy.get('mat-form-field').contains('span', 'Select Product').parents('mat-form-field').click();
    cy.get('mat-option').contains('span', 'Forza Motorsport Premium Edition').click();
    waitForProgressSpinners();

    cy.contains('td', 'CNY').parent().contains('td', '398').should('exist');
    cy.contains('td', 'USD').parent().contains('td', '99.99').should('exist');
    cy.contains('td', 'EUR').parent().contains('td', '99.99').should('exist');
    cy.contains('td', 'JPY').parent().contains('td', '12980').should('exist');
  });

  it('should populate pricing on page load FM Premium Add-Ons Bundle', () => {
    cy.get('mat-form-field').contains('span', 'Select Product').parents('mat-form-field').click();
    cy.get('mat-option').contains('span', 'Forza Motorsport Premium Add-Ons Bundle').click();
    waitForProgressSpinners();

    cy.contains('td', 'CNY').parent().contains('td', '176').should('exist');
    cy.contains('td', 'USD').parent().contains('td', '39.99').should('exist');
    cy.contains('td', 'EUR').parent().contains('td', '39.99').should('exist');
    cy.contains('td', 'JPY').parent().contains('td', '5380').should('exist');
  });
});
