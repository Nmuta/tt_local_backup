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
    waitForProgressSpinners();
    const $chipList = cy.get('mat-chip-list');
    $chipList.within(() => {
      const $inputChipList = cy.get('input');
      $inputChipList.click().type('Player Details{enter}');
    });

    waitForProgressSpinners();
    cy.get('.mat-card-title').contains('Player Details');
    cy.get('mat-chip').contains('1').should('exist');
    cy.get('span').contains('Tools below do not match filters').should('exist');
  });

  it('should filter tools by input', () => {
    waitForProgressSpinners();
    const $chipList = cy.get('mat-chip-list');
    $chipList.within(() => {
      const $inputChipList = cy.get('input');
      $inputChipList.click().type('Player{enter}');
    });

    waitForProgressSpinners();
    cy.get('mat-chip').contains('7').should('exist');
    cy.get('span').contains('Tools below do not match filters').should('exist');
  });

  it('should filter tools by title', () => {
    waitForProgressSpinners();
    const $chipList = cy.get('mat-chip-list');
    $chipList.within(() => {
      const $inputChipList = cy.get('input');
      $inputChipList.click();
    });
    const $optionList = cy.get('mat-option');
    $optionList.within(() => {
      const $option = cy.get('span').contains('FH5');
      $option.click();
    });

    waitForProgressSpinners();
    cy.get('mat-chip').contains('23').should('exist');
    cy.get('span').contains('Tools below do not match filters').should('exist');
  });

  it('should filter tools with multiple filters', () => {
    waitForProgressSpinners();
    const $chipList = cy.get('mat-chip-list');
    $chipList.within(() => {
      const $inputChipList = cy.get('input');
      $inputChipList.click().type('Player{enter}');
      $inputChipList.click();
    });
    const $optionList = cy.get('mat-option');
    $optionList.within(() => {
      const $option = cy.get('span').contains('FM7');
      $option.click();
    });

    waitForProgressSpinners();
    cy.get('mat-chip').contains('5').should('exist');
    cy.get('span').contains('Tools below do not match filters').should('exist');
  });

  it('should reset when filters are removed', () => {
    waitForProgressSpinners();
    const $chipList = cy.get('mat-chip-list');
    $chipList.within(() => {
      const $inputChipList = cy.get('input');
      $inputChipList.click().type('Player{enter}');
      $inputChipList.click();
    });
    const $optionList = cy.get('mat-option');
    $optionList.within(() => {
      const $option = cy.get('span').contains('FM7');
      $option.click();
    });

    waitForProgressSpinners();
    cy.contains('mat-icon', 'close').click();
    cy.get('mat-chip').contains('33').should('exist');
    cy.get('span').contains('Tools below do not match filters').should('not.exist');
  });
});
