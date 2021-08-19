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

  it('should lead to Live Ops Tools', () => {
    cy.get('.mat-button-wrapper').contains('Live Ops Tools').click();

    cy.contains('Steward Live Ops App').should('exist');
  });

  it('should lead to Support Tools', () => {
    cy.get('.mat-button-wrapper').contains('Support Tools').click();

    cy.contains('Steward Support App').should('exist');
  });

  it('should have link to Support Ticket Tools', () => {
    cy.get('.mat-button-wrapper').contains('Support Ticket Tools').should('exist');
    cy.contains('a', 'Support Ticket Tools').should(
      'have.attr',
      'href',
      '/support/ticket-app/title',
    );
    // this cannot be fully tested outside of zendesk
    // cy.contains('Steward Support Ticket App').should('exist');
  });

  it('should lead to Community Manager Tools', () => {
    cy.get('.mat-button-wrapper').contains('Community Manager Tools').click();

    cy.contains('Steward Community App').should('exist');
  });

  it('should lead to Data Pipeline Tools', () => {
    cy.get('.mat-button-wrapper').contains('Data Pipeline Tools').click();

    cy.contains('Steward Data Pipeline App').should('exist');
  });
});
