import { login } from '@support/steward/auth/login';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';

context('Steward Index', () => {
  beforeEach(() => {
    login();

    cy.visit('/');
  });

  it('should lead to Tools homepage', () => {
    // Verfiy cards
    cy.get('.mat-card-title').contains('Player Details');
    cy.get('.mat-card-title').contains('UGC Search');
    cy.get('.mat-card-title').contains('UGC Details');

    // Verify icons
    cy.get('.mat-icon').contains('notifications');
    cy.get('.mat-icon').contains('sticky_note_2');
    cy.get('.mat-icon').contains('account_circle');
    cy.get('.mat-icon').contains('contact_support');
  });

  it('should search for a specific tool', () => {
    cy.get('mat-chip-list').click().type('Player Details');
    cy.get('input').type('{enter}');
    waitForProgressSpinners();
    cy.get('.mat-card-title').contains('Player Details');
    cy.get('mat-chip').contains('1').should('exist');
    cy.get('span').contains('Tools below do not match filters').should('exist');
  });

  it('should filter tools by input', () => {
    cy.get('mat-chip-list').click().type('Player');
    cy.get('input').type('{enter}');
    waitForProgressSpinners();
    cy.get('mat-chip').contains('7').should('exist');
    cy.get('span').contains('Tools below do not match filters').should('exist');
  });

  it('should filter tools by title', () => {
    cy.get('mat-chip-list').click();
    cy.get('mat-option').contains('span', 'FH5').click();
    waitForProgressSpinners();
    cy.get('mat-chip').contains('23').should('exist');
    cy.get('span').contains('Tools below do not match filters').should('exist');
  });

  it('should reset when filters are removed', () => {
    cy.get('mat-chip-list').click().type('Player');
    cy.get('input').type('{enter}');
    waitForProgressSpinners();
    cy.contains('mat-icon', 'close').click();
    cy.get('mat-chip').contains('33').should('exist');
    cy.get('span').contains('Tools below do not match filters').should('not.exist');
  });
});
