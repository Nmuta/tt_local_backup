import { login } from '@support/steward/auth/login';

context('Steward Index', () => {
  beforeEach(() => {
    login();

    cy.visit('/');
  });

  it('should have a logout button', () => {
    cy.get('.mat-button-wrapper').contains('Logout').should('exist');
  });

  it('should lead to User Selected Tools', () => {
    cy.get('.mat-button-wrapper').contains('User Selected Tools').click();

    cy.contains('Click to set standard tools').should('exist');
  });

  it('should have link to Zendesk Ticket Tools', () => {
    cy.get('.mat-button-wrapper').contains('Zendesk Ticket Tools').should('exist');
    cy.contains('a', 'Zendesk Ticket Tools').should('have.attr', 'href', '/ticket-app/title');
    // this cannot be fully tested outside of zendesk
    // cy.contains('Steward Support Ticket App').should('exist');
  });
});
