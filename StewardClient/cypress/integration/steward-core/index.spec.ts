import { login } from '../../utility/steward-auth/login';

context('Steward Index', () => {
  beforeEach(() => {
    login();
    cy.visit('/');
  });

  it('should have a logout button', () => {
    cy.get('.mat-button-wrapper').contains('Logout').should('exist');
  });

  it('should lead to Live Ops App', () => {
    cy.get('.mat-button-wrapper').contains('Live Ops App').click();

    cy.contains('Steward Live Ops App');
  });

  it('should lead to Support App', () => {
    cy.get('.mat-button-wrapper').contains('Support App').click();

    cy.contains('Steward Support App');
  });

  // this cannot be tested outside of zendesk
  //// it('should lead to Support Ticket App', () => {
  ////   cy.get('.mat-button-wrapper').contains('Support Ticket App')
  ////     .click();
  ////   cy.contains('Steward Support Ticket App');
  //// });

  it('should lead to Community Manager App', () => {
    cy.get('.mat-button-wrapper').contains('Community Manager App').click();

    cy.contains('Steward Community App');
  });

  it('should lead to Data Pipeline App', () => {
    cy.get('.mat-button-wrapper').contains('Data Pipeline App').click();

    cy.contains('Steward Data Pipeline App');
  });
});
