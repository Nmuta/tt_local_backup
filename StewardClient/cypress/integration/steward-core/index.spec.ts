import { login } from '@support/steward/auth/login';

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

    cy.contains('Steward Live Ops App').should('exist');
  });

  it('should lead to Support App', () => {
    cy.get('.mat-button-wrapper').contains('Support App').click();

    cy.contains('Steward Support App').should('exist');
  });

  it('should have link to Support Ticket App', () => {
    cy.get('.mat-button-wrapper').contains('Support Ticket App').should('exist');
    cy.contains('a', 'Support Ticket App').should('have.attr', 'href', '/support/ticket-app/title');
    // this cannot be fully tested outside of zendesk
    // cy.contains('Steward Support Ticket App').should('exist');
  });

  it('should lead to Community Manager App', () => {
    cy.get('.mat-button-wrapper').contains('Community Manager App').click();

    cy.contains('Steward Community App').should('exist');
  });

  it('should lead to Data Pipeline App', () => {
    cy.get('.mat-button-wrapper').contains('Data Pipeline App').click();

    cy.contains('Steward Data Pipeline App').should('exist');
  });
});
